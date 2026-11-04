import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const entrypoints = [
  "index.html",
  "projects.html",
  "stack.html",
  "engineering-map.html",
  "health-fonna.html",
  "security-lab.html",
  "swarm.html",
];

const failures = [];
const privateRepoLink = /https?:\/\/github\.com\/abla86\/(?!developer-portfolio(?:\/|#|\?|$))[A-Za-z0-9_.-]+/i;
for (const file of entrypoints) {
  const fullPath = join(root, file);
  if (!existsSync(fullPath)) {
    failures.push(`Missing public entry point: ${file}`);
    continue;
  }

  const html = readFileSync(fullPath, "utf8");
  if (!/<!doctype\s+html/i.test(html)) failures.push(`${file}: missing HTML5 doctype`);
  if (!/<html\b[^>]*\blang\s*=\s*["'][^"']+["']/i.test(html)) failures.push(`${file}: missing document language`);
  if (!/<title>\s*[^<]+\s*<\/title>/i.test(html)) failures.push(`${file}: missing page title`);
  if (privateRepoLink.test(html)) failures.push(`${file}: contains a link to a private repository`);
}

const readmePath = join(root, "README.md");
if (existsSync(readmePath) && privateRepoLink.test(readFileSync(readmePath, "utf8"))) {
  failures.push("README.md: contains a link to a private repository");
}

if (failures.length) {
  console.error("Portfolio integrity check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Portfolio integrity check passed: ${entrypoints.length} public entry points pass metadata and private-repository-link checks.`);
}
