import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const failures = [];
const warnings = [];
const plan = [];
const textFiles = [];
// PROJECT REGISTRY PRECHECK
const registryPath = path.join(root, "scripts", "project-registry.json");
if (fs.existsSync(registryPath)) {
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  for (const p of registry.projects ?? []) {
    if (!p.repo || !p.displayName || !p.description) failures.push(`Invalid project registry entry: ${p.repo ?? "unknown"}`);
  }
  for (const p of registry.excluded ?? []) {
    if (!p.repo || !p.reason) failures.push(`Invalid exclusion registry entry: ${p.repo ?? "unknown"}`);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(html|css|js|mjs|json|md|txt)$/i.test(entry.name)) textFiles.push(full);
  }
}
walk(root);

const rel = f => path.relative(root, f).replaceAll(path.sep, "/");
const read = f => fs.readFileSync(f, "utf8");

function encodingFixes(content) {
  const replacements = new Map([
    ["Â·","·"],["Â©","©"],["Â®","®"],["Â°","°"],["Â±","±"],
    ["Â",""],["Ã¦","æ"],["Ã¸","ø"],["Ã¥","å"],["Ã†","Æ"],["Ã˜","Ø"],["Ã…","Å"],
    ["âœ“","✓"],["â€”","—"],["â€“","–"],["â†’","→"],["â€¢","•"]
  ]);
  let fixed = content;
  for (const [bad, good] of replacements) fixed = fixed.split(bad).join(good);
  return fixed;
}

// PHASE 1: DISCOVER AND VERIFY — NO FILES ARE CHANGED.
for (const file of textFiles) {
  const content = read(file);
  const fixed = encodingFixes(content);
  if (fixed !== content) plan.push({type:"encoding",file:rel(file),before:content,after:fixed});
  if (/[ÂÃ][\x80-\xBF]/.test(fixed) || /â(?:[\x80-\xBF])/.test(fixed))
    failures.push(`Encoding remains suspect: ${rel(file)}`);
  if (/^<html|<!doctype html/i.test(content.trim()) && !/<meta[^>]+charset=["']?utf-8/i.test(content))
    warnings.push(`HTML has no explicit UTF-8 charset: ${rel(file)}`);
}

const htmlFiles = textFiles.filter(f => /\.html$/i.test(f));
for (const file of htmlFiles) {
  const content = read(file);
  const links = [...content.matchAll(/(?:href|src)=["']([^"'#]+)(?:#.*?)?["']/gi)].map(m=>m[1]);
  for (const target of links) {
    if (/^(https?:|mailto:|tel:|javascript:|data:)/i.test(target)) continue;
    const resolved = path.resolve(path.dirname(file), target.split("?")[0]);
    if (!fs.existsSync(resolved)) failures.push(`Broken local link: ${rel(file)} -> ${target}`);
  }
}

// LIVE GITHUB REGISTRY VERIFICATION
const ghToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const ghOwner = process.env.GITHUB_REPOSITORY_OWNER || "abla86";
const repoNames = new Set();
async function githubJson(url) {
  if (!ghToken) {
    failures.push("GitHub verification unavailable: GH_TOKEN/GITHUB_TOKEN is missing");
    return null;
  }
  const response = await fetch(url, {
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${ghToken}`,
      "x-github-api-version": "2022-11-28",
      "user-agent": "CodeSentinel"
    }
  });
  if (!response.ok) {
    failures.push(`GitHub API ${response.status}: ${url}`);
    return null;
  }
  return response.json();
}

if (ghToken) {
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  const promoted = new Set((registry.projects ?? []).map(p => p.repo.toLowerCase()));
  const excluded = new Set((registry.excluded ?? []).map(p => p.repo.toLowerCase()));

  for (const entry of registry.projects ?? []) {
    if (repoNames.has(entry.repo.toLowerCase())) failures.push(`Duplicate registry project: ${entry.repo}`);
    repoNames.add(entry.repo.toLowerCase());
    const repo = await githubJson(`https://api.github.com/repos/${ghOwner}/${entry.repo}`);
    if (!repo) continue;
    if (repo.archived) failures.push(`Portfolio project is archived but promoted: ${entry.repo}`);
    if (repo.owner?.login?.toLowerCase() !== ghOwner.toLowerCase())
      failures.push(`Portfolio project owner mismatch: ${entry.repo}`);
    const readme = await githubJson(`https://api.github.com/repos/${ghOwner}/${entry.repo}/readme`);
    if (!readme?.content) failures.push(`Portfolio project has no readable README: ${entry.repo}`);
    else {
      const decoded = Buffer.from(readme.content, "base64").toString("utf8");
      if (decoded.trim().length < 80) failures.push(`Portfolio project README is unexpectedly short: ${entry.repo}`);
    }
  }

  for (const entry of registry.excluded ?? []) {
    if (promoted.has(entry.repo.toLowerCase()))
      failures.push(`Repository appears in both promoted and excluded registry: ${entry.repo}`);
  }

  const allRepos = await githubJson(`https://api.github.com/users/${ghOwner}/repos?per_page=100&type=all&sort=updated`);
  if (Array.isArray(allRepos)) {
    for (const repo of allRepos) {
      if (repo.owner?.login?.toLowerCase() !== ghOwner.toLowerCase()) continue;
      if (!repo.archived && repo.name !== "developer-portfolio" && !promoted.has(repo.name.toLowerCase()) && !excluded.has(repo.name.toLowerCase()))
        warnings.push(`Active repository is not classified in portfolio registry: ${repo.name}`);
    }
  }
}

// External targets are validated for identity, not merely HTTP 200.
const externalChecks = [
  ["Workforce live demo","https://workforce-frontend.onrender.com",["<title>vaktklar","vaktklar – bemanning og kompetanse"]],
  ["Evidence live demo","https://evidence-appraisal-tool.onrender.com",["<title>evidenceflow","evidenceflow – research support"]]
];
for (const [name,url,markers] of externalChecks) {
  try {
    const response = await fetch(url,{redirect:"follow"});
    const body=(await response.text()).slice(0,300000).toLowerCase();
    if (!response.ok) failures.push(`${name}: HTTP ${response.status}`);
    else if (!markers.some(m=>body.includes(m))) failures.push(`${name}: reachable but identity check failed`);
    else console.log(`IDENTITY OK: ${name} -> ${response.url}`);
  } catch(e) {
    failures.push(`${name}: unavailable: ${e.message}`);
  }
}

// Validate every proposed repair before writing anything.
for (const item of plan) {
  const validation = encodingFixes(item.after);
  if (validation !== item.after) {
    failures.push(`Proposed encoding repair is not idempotent: ${item.file}`);
  } else if (/[ÂÃ][\x80-\xBF]/.test(item.after) || /â(?:[\x80-\xBF])/.test(item.after)) {
    failures.push(`Proposed repair does not remove encoding error: ${item.file}`);
  }
}

// PHASE 2: APPLY ONLY VERIFIED, DETERMINISTIC FIXES.
if (failures.length) {
  console.error("PREFLIGHT FAILED. NOTHING WAS MODIFIED.");
  failures.forEach(x=>console.error("FAIL:",x));
  process.exit(1);
}

for (const item of plan) {
  fs.writeFileSync(path.join(root,item.file),item.after,"utf8");
  console.log("REPAIRED:",item.file);
}

// PHASE 3: RE-SCAN AFTER REPAIR.
const verifyFailures=[];
for (const file of textFiles) {
  const content=read(file);
  if (/[ÂÃ][\x80-\xBF]/.test(content) || /â(?:[\x80-\xBF])/.test(content))
    verifyFailures.push(`Encoding still present: ${rel(file)}`);
}
if (verifyFailures.length) {
  console.error("POST-REPAIR VERIFICATION FAILED.");
  verifyFailures.forEach(x=>console.error("FAIL:",x));
  process.exit(1);
}

console.log("\n=== CODESENTINEL ===");
console.log(`Files scanned: ${textFiles.length}`);
console.log(`HTML files scanned: ${htmlFiles.length}`);
console.log(`Verified repairs applied: ${plan.length}`);
console.log(`Warnings: ${warnings.length}`);
warnings.forEach(x=>console.log("WARNING:",x));
console.log("\nPREFLIGHT -> PASS");
console.log("REPAIR -> PASS");
console.log("POST-REPAIR VERIFICATION -> PASS");
console.log("AUDIT PASSED.");
