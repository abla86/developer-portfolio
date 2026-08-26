import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];
const repairs = [];

const textFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(html|css|js|mjs|json|md|txt)$/i.test(entry.name)) textFiles.push(full);
  }
}
walk(root);

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function rel(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function safeEncodingRepair(file, content) {
  const replacements = new Map([
    ["Â·", "·"],
    ["Â©", "©"],
    ["Â®", "®"],
    ["Â°", "°"],
    ["Â±", "±"],
    ["Â", ""],
    ["Ã¦", "æ"],
    ["Ã¸", "ø"],
    ["Ã¥", "å"],
    ["Ã†", "Æ"],
    ["Ã˜", "Ø"],
    ["Ã…", "Å"],
    ["âœ“", "✓"],
    ["â€”", "—"],
    ["â€“", "–"],
    ["â†’", "→"],
    ["â€¢", "•"]
  ]);

  let fixed = content;
  for (const [bad, good] of replacements) fixed = fixed.split(bad).join(good);

  if (fixed !== content) {
    fs.writeFileSync(file, fixed, "utf8");
    repairs.push(rel(file));
    return fixed;
  }
  return content;
}

for (const file of textFiles) {
  let content = read(file);
  content = safeEncodingRepair(file, content);

  if (/[ÂÃ][\x80-\xBF]/.test(content) || /â(?:[\x80-\xBF])/.test(content)) {
    failures.push(`Encoding suspect: ${rel(file)}`);
  }

  if (/^<html|<!doctype html/i.test(content.trim())) {
    if (!/<meta[^>]+charset=["']?utf-8/i.test(content)) {
      warnings.push(`HTML has no explicit UTF-8 charset: ${rel(file)}`);
    }
  }
}

const htmlFiles = textFiles.filter(f => /\.html$/i.test(f));
const localTargets = new Set();

for (const file of htmlFiles) {
  const content = read(file);
  const links = [...content.matchAll(/(?:href|src)=["']([^"'#]+)(?:#.*?)?["']/gi)].map(m => m[1]);

  for (const target of links) {
    if (/^(https?:|mailto:|tel:|javascript:|data:)/i.test(target)) continue;
    const clean = target.split("?")[0];
    const resolved = path.resolve(path.dirname(file), clean);
    if (!fs.existsSync(resolved)) {
      failures.push(`Broken local link: ${rel(file)} -> ${target}`);
    } else {
      localTargets.add(rel(resolved));
    }
  }
}

const externalChecks = [
  ["Workforce live demo", "https://workforce-frontend.onrender.com", ["workforce", "vaktklar"]],
  ["Evidence live demo", "https://evidence-appraisal-tool.onrender.com", ["evidence", "appraisal"]]
];

for (const [name, url, markers] of externalChecks) {
  try {
    const response = await fetch(url, { redirect: "follow" });
    const body = (await response.text()).slice(0, 300000).toLowerCase();

    if (!response.ok) {
      failures.push(`${name}: HTTP ${response.status} at ${url}`);
      continue;
    }

    if (!markers.some(m => body.includes(m))) {
      failures.push(`${name}: reachable but content does not contain an expected project marker: ${url}`);
    } else {
      console.log(`OK: ${name} -> HTTP ${response.status}, expected marker found`);
    }
  } catch (error) {
    warnings.push(`${name}: could not reach ${url}: ${error.message}`);
  }
}

const index = path.join(root, "index.html");
if (fs.existsSync(index)) {
  const c = read(index);
  const hrefs = [...c.matchAll(/href=["'](https?:\/\/[^"']+)["']/gi)].map(m => m[1]);
  console.log(`Portfolio external links found: ${hrefs.length}`);
}

console.log("\n=== PORTFOLIO SELF AUDIT ===");
console.log(`Files scanned: ${textFiles.length}`);
console.log(`HTML files scanned: ${htmlFiles.length}`);
console.log(`Safe repairs: ${repairs.length}`);
console.log(`Failures: ${failures.length}`);
console.log(`Warnings: ${warnings.length}`);

for (const x of repairs) console.log(`REPAIRED: ${x}`);
for (const x of warnings) console.log(`WARNING: ${x}`);
for (const x of failures) console.log(`FAIL: ${x}`);

if (failures.length) {
  console.error("\nAudit failed. No automatic repair is allowed for these failures.");
  process.exit(1);
}

console.log("\nAUDIT PASSED.");
