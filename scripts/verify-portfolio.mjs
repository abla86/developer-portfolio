import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const ignoredDirectories = new Set([".git", "archive", "node_modules"]);
const collectHtmlFiles = (directory = root, prefix = "") => {
  const found = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        found.push(...collectHtmlFiles(join(directory, entry.name), prefix ? `${prefix}/${entry.name}` : entry.name));
      }
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      found.push(prefix ? `${prefix}/${entry.name}` : entry.name);
    }
  }
  return found;
};
const entrypoints = collectHtmlFiles().sort();

const failures = [];
const hasPrivateRepoLink = value => [...value.matchAll(/https?:\/\/github\.com\/abla86\/[A-Za-z0-9_.-]+/gi)].some(match => !match[0].endsWith("/developer-portfolio"));
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
  if (hasPrivateRepoLink(html)) failures.push(`${file}: contains a link to a private repository`);
}

for (const file of ["README.md", "readme.md", "data/ecosystem.json"]) {
  const fullPath = join(root, file);
  if (!existsSync(fullPath)) continue;
  const content = readFileSync(fullPath, "utf8");
  if (hasPrivateRepoLink(content)) failures.push(`${file}: contains a link to a private repository`);
  if (file.endsWith(".json")) {
    try {
      JSON.parse(content);
    } catch {
      failures.push(`${file}: invalid JSON`);
    }
  }
}

if (failures.length) {
  console.error("Portfolio integrity check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Portfolio integrity check passed: ${entrypoints.length} public HTML entry points pass metadata and private-repository-link checks; README and project data files pass private-link and JSON validation.`);
}
