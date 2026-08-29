import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
if (!token) throw new Error("GH_TOKEN/GITHUB_TOKEN is required.");

const registry = JSON.parse(fs.readFileSync(path.join(root,"scripts","project-registry.json"),"utf8"));
const headers = {
  accept:"application/vnd.github+json",
  "x-github-api-version":"2022-11-28",
  ...(token ? {authorization:`Bearer ${token}`} : {})
};

async function gh(url) {
  const r = await fetch(`https://api.github.com${url}`,{headers});
  if (!r.ok) {
    const error = new Error(`GitHub API ${r.status}: ${url}`);
    error.status = r.status;
    throw error;
  }
  return r.json();
}

async function repoFacts(repo) {
  const [meta,languages,readme,contents] = await Promise.all([
    gh(`/repos/${repo}`),
    gh(`/repos/${repo}/languages`),
    gh(`/repos/${repo}/readme`),
    gh(`/repos/${repo}/contents`)
  ]);
  const names = contents.map(x=>x.name);
  const readmeText = Buffer.from(readme.content,"base64").toString("utf8");
  const tech = new Set(Object.keys(languages));
  const has = n => names.some(x=>x.toLowerCase()===n.toLowerCase());
  if (has("package.json")) tech.add("Node.js");
  if (names.some(x=>/\.csproj$/i.test(x))) tech.add(".NET");
  if (has("Dockerfile") || has("docker-compose.yml") || has("compose.yml")) tech.add("Docker");
  if (names.includes(".github")) tech.add("GitHub Actions");
  return {
    repo,
    url:meta.html_url,
    defaultBranch:meta.default_branch,
    archived:meta.archived,
    description:meta.description,
    stars:meta.stargazers_count,
    updatedAt:meta.updated_at,
    pushedAt:meta.pushed_at,
    languages:Object.keys(languages),
    detectedTechnology:[...tech],
    files:names,
    readme:readmeText
  };
}

const results=[];
for (const project of registry.projects) {
  try {
    const facts=await repoFacts(`abla86/${project.repo}`);
    results.push({
      ...project,
      status:"verified-source",
      source:facts
    });
  } catch (e) {
    if (e?.status === 404) {
      results.push({
        ...project,
        status:"not-accessible-with-workflow-token",
        error:"Repository is not accessible to this repository's GITHUB_TOKEN. No project fact was promoted."
      });
      continue;
    }
    results.push({...project,status:"needs-review",error:e.message});
  }
}

const output={
  generatedAt:new Date().toISOString(),
  source:"GitHub repository inspection",
  policy:registry.policy,
  projects:results,
  excluded:registry.excluded
};

fs.writeFileSync(path.join(root,"scripts","project-facts.generated.json"),JSON.stringify(output,null,2)+"\n","utf8");

const failures=results.filter(x=>x.status==="needs-review");
if(failures.length){
  console.error("PROJECT INSPECTION FAILED");
  failures.forEach(x=>console.error(x.repo,x.error));
  process.exit(1);
}
const inaccessible=results.filter(x=>x.status==="not-accessible-with-workflow-token");
console.log(`INSPECTED ${results.length} registered projects.`);
console.log(`VERIFIED ${results.filter(x=>x.status==="verified-source").length}.`);
console.log(`NOT ACCESSIBLE WITH WORKFLOW TOKEN ${inaccessible.length}; these were not promoted as verified facts.`);
console.log("PROJECT FACTS GENERATED.");
