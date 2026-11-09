#!/usr/bin/env node
/**
 * L0 release gates — cheap, full-repo static checks that run on every PR.
 *
 *   node script/check-gates.mjs            run all gates, exit 1 on failure
 *
 * Gates:
 *   1. component integrity — every src/components/<name>/ has its 4 files,
 *      .json parses, and every usingComponents ref resolves (relative,
 *      root-absolute, or bare package self-ref).
 *   2. package size — packages/ui/dist main + example subpackages stay under
 *      the WeChat limits (needs `npm run build` first; skipped when dist
 *      doesn't exist).
 *   3. palette consistency — hex colors in component wxss (excluding
 *      _example) must be token values or in script/gates/off-palette.json
 *      (the audited allowlist of intentional one-offs). NEW off-palette
 *      colors fail; extend the allowlist deliberately.
 *
 * Advisory (printed, never fails):
 *   - safe-area: components with position:fixed but no env(safe-area-inset)
 *     — only edge-attached ones actually need it (toast is the reference).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const uiSrc = path.join(root, 'packages/ui/src');
const uiDist = path.join(root, 'packages/ui/dist');
const exampleDir = path.join(root, 'packages/example');
const PKG_NAME = 'looseleaf-miniprogram';

let failures = 0;
const advisories = [];
const fail = (msg) => { console.error(`✗ ${msg}`); failures++; };

// --- 1. component integrity -------------------------------------------------
const componentsDir = path.join(uiSrc, 'components');
const names = fs
  .readdirSync(componentsDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

for (const name of names) {
  const dir = path.join(componentsDir, name);
  // wxss is optional (a few wrappers are wxml/js only); the rest are required.
  for (const ext of ['js', 'json', 'wxml']) {
    if (!fs.existsSync(path.join(dir, `${name}.${ext}`))) {
      fail(`component ${name}: missing ${name}.${ext}`);
    }
  }
  const jsonPath = path.join(dir, `${name}.json`);
  let json;
  try {
    json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch (e) {
    fail(`component ${name}: ${name}.json does not parse (${e.message})`);
    continue;
  }
  for (const [tag, ref] of Object.entries(json.usingComponents ?? {})) {
    let resolved = null;
    if (ref.startsWith('.')) resolved = path.resolve(dir, ref);
    else if (ref.startsWith('/')) resolved = path.join(uiSrc, ref);
    else if (ref.startsWith(`${PKG_NAME}/`)) resolved = path.join(uiSrc, ref.slice(PKG_NAME.length + 1));
    else { fail(`component ${name}: unresolvable usingComponents ref "${tag}: ${ref}"`); continue; }
    if (!fs.existsSync(`${resolved}.json`)) {
      fail(`component ${name}: usingComponents "${tag}" → ${ref} does not exist`);
    }
  }
}
console.log(`✓ component integrity (${names.length} components)`);

// --- 2. package size --------------------------------------------------------
// WeChat hard limits: every package ≤ 2MB on upload (80051). Files not
// uploaded (project.config.*, package.json, node_modules) are excluded.
const LIMIT_MAIN = 2 * 1024 * 1024;
const LIMIT_SUB = 2 * 1024 * 1024;
const NOT_UPLOADED = /^project\.config.*\.json$|^package\.json$|node_modules/;
const dirSize = (d) => {
  if (!fs.existsSync(d)) return -1;
  let total = 0;
  const walk = (p) => {
    for (const e of fs.readdirSync(p, { withFileTypes: true })) {
      const f = path.join(p, e.name);
      if (e.isDirectory()) {
        if (e.name === 'node_modules') continue;
        walk(f);
      } else if (!NOT_UPLOADED.test(e.name)) {
        total += fs.statSync(f).size;
      }
    }
  };
  walk(d);
  return total;
};

const distSize = dirSize(uiDist);
if (distSize < 0) {
  console.log('⚠ size gate skipped — packages/ui/dist missing (run `npm run build` first)');
} else {
  console.log(`✓ size: packages/ui/dist ${(distSize / 1024 / 1024).toFixed(2)}MB (informational; example is what's limited)`);
}

if (fs.existsSync(exampleDir)) {
  // example main package = everything except the subpackage roots
  const subRoots = ['pkg-forms', 'pkg-feedback', 'pkg-data', 'pkg-paper', 'pkg-interactive'];
  const mainSize = dirSize(exampleDir) - subRoots.reduce((acc, r) => acc + Math.max(dirSize(path.join(exampleDir, r)), 0), 0);
  if (mainSize > LIMIT_MAIN) {
    fail(`example main package ${(mainSize / 1024 / 1024).toFixed(2)}MB exceeds 2MB gate (80051)`);
  } else if (mainSize >= 0) {
    console.log(`✓ size: example main package ${(mainSize / 1024 / 1024).toFixed(2)}MB ≤ 2MB`);
  }
  for (const r of subRoots) {
    const size = dirSize(path.join(exampleDir, r));
    if (size < 0) continue;
    if (size > LIMIT_SUB) fail(`subpackage ${r} ${(size / 1024 / 1024).toFixed(2)}MB exceeds 2MB gate`);
  }
}

// --- 3. palette consistency -------------------------------------------------
import TOKENS from '../packages/ui/src/common/tokens.js';
const expand3 = (h) => (/^#[0-9a-f]{3}$/i.test(h) ? `#${[...h.slice(1)].map((c) => c + c).join('')}` : h);
const palette = new Set();
for (const v of Object.values(TOKENS)) {
  for (const m of String(v).matchAll(/#[0-9a-fA-F]{3,8}/g)) {
    palette.add(m[0].toLowerCase());
    palette.add(expand3(m[0]).toLowerCase());
  }
}
const allowlistPath = path.join(root, 'script/gates/off-palette.json');
const allowlist = new Set(JSON.parse(fs.readFileSync(allowlistPath, 'utf8')));

const wxssFiles = [];
const walkWxss = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (e.name === '_example') continue; // demo-only styles don't ship in the package
      walkWxss(p);
    } else if (p.endsWith('.wxss')) wxssFiles.push(p);
  }
};
walkWxss(path.join(componentsDir, '..'));

const newOffenders = new Map(); // hex -> [files]
for (const f of wxssFiles) {
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
    const hex = m[0].toLowerCase();
    const norm = expand3(hex);
    if (palette.has(hex) || palette.has(norm.toLowerCase())) continue;
    if (allowlist.has(hex) || allowlist.has(norm.toLowerCase())) continue;
    if (!newOffenders.has(hex)) newOffenders.set(hex, []);
    const rel = path.relative(uiSrc, f);
    if (!newOffenders.get(hex).includes(rel)) newOffenders.get(hex).push(rel);
  }
}
if (newOffenders.size > 0) {
  const detail = [...newOffenders.entries()]
    .map(([hex, files]) => `    ${hex} in ${files.join(', ')}`)
    .join('\n');
  fail(`new off-palette color(s) in component wxss — add to script/gates/off-palette.json only if intentional:\n${detail}`);
} else {
  console.log(`✓ palette consistency (${wxssFiles.length} wxss files, ${allowlist.size} allowlisted one-offs)`);
}

// --- advisory: safe-area ----------------------------------------------------
const fixedNoSafeArea = [];
for (const f of wxssFiles) {
  const src = fs.readFileSync(f, 'utf8');
  if (/position:\s*fixed/.test(src) && !/safe-area-inset/.test(src)) {
    fixedNoSafeArea.push(path.relative(uiSrc, f));
  }
}
if (fixedNoSafeArea.length) {
  advisories.push(
    `position:fixed without env(safe-area-inset) — only edge-attached overlays need it (toast is the reference):\n    ${fixedNoSafeArea.join(', ')}`
  );
}

for (const a of advisories) console.log(`⚠ advisory: ${a}`);

if (failures > 0) {
  console.error(`\ncheck-gates: ${failures} failure(s)`);
  process.exit(1);
}
console.log('\ncheck-gates: all gates passed');
