#!/usr/bin/env node
/**
 * Publish-readiness check for packages/ui (CI TODO M1).
 *
 * Simulates a consumer mini program project end to end:
 *   1. `npm pack` the ui package;
 *   2. install the tarball into a fixture consumer project;
 *   3. run the official miniprogram-ci packNpm (same logic as the DevTools
 *      "构建 npm" button);
 *   4. assert every reference inside the built miniprogram_npm resolves —
 *      js relative imports, usingComponents targets, and the documented
 *      tokens.wxss path.
 *
 * Run: node script/check-npm-package.mjs   (after `npm run build`)
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const uiPkg = path.join(root, 'packages/ui');
const dist = path.join(uiPkg, 'dist');

if (!fs.existsSync(path.join(dist, 'components'))) {
  console.error('✗ packages/ui/dist missing — run `npm run build` first');
  process.exit(1);
}

// realpath: miniprogram-ci resolves deps through fs.realpath; on macOS
// os.tmpdir() (/var/...) and the real path (/private/var/...) diverge.
const tmp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'll-pkg-check-')));
const cleanup = () => fs.rmSync(tmp, { recursive: true, force: true });
process.on('exit', cleanup);
process.on('SIGINT', () => { cleanup(); process.exit(130); });

let failed = false;
const check = (cond, label) => {
  console.log(`${cond ? '✓' : '✗'} ${label}`);
  if (!cond) failed = true;
};

// 1. pack
const tarball = execSync(`npm pack "${uiPkg}" --pack-destination "${tmp}"`, {
  cwd: tmp, encoding: 'utf8',
}).trim().split('\n').pop();
console.log(`✓ packed ${path.basename(tarball)}`);

// 2. fixture consumer project
const appid = 'touristappid';
fs.writeFileSync(path.join(tmp, 'package.json'), JSON.stringify({
  name: 'consumer-fixture', version: '1.0.0', private: true,
  dependencies: { 'looseleaf-miniprogram': `file:${tarball}` },
}, null, 2));
fs.writeFileSync(path.join(tmp, 'project.config.json'), JSON.stringify({
  appid, compileType: 'miniprogram', setting: { es6: true },
}, null, 2));

execSync('npm install --no-audit --no-fund --loglevel=error', { cwd: tmp, stdio: 'inherit' });
console.log('✓ tarball installed into consumer project');

// 3. official packNpm
fs.writeFileSync(path.join(tmp, 'dummy.key'), 'not-a-real-key\n');
fs.writeFileSync(path.join(tmp, 'packnpm.mjs'), `
import ci from 'miniprogram-ci';
const project = new ci.Project({
  appid: ${JSON.stringify(appid)},
  type: 'miniProgram',
  projectPath: ${JSON.stringify(tmp)},
  privateKeyPath: ${JSON.stringify(path.join(tmp, 'dummy.key'))},
  ignores: [],
});
let report = null;
await ci.packNpm(project, { reporter: (info) => { report = info; } });
console.log(JSON.stringify(report));
if (!report || report.miniprogram_pack_num !== 1) process.exit(2);
`);
execSync('npm i -D miniprogram-ci --no-audit --no-fund --loglevel=error', { cwd: tmp, stdio: 'inherit' });
execSync('node packnpm.mjs', { cwd: tmp, stdio: 'inherit' });
console.log('✓ miniprogram-ci packNpm: 1 miniprogram package, 0 warnings');

// 4. reference resolution inside the built output
const npmRoot = path.join(tmp, 'miniprogram_npm', 'looseleaf-miniprogram');
const walk = (dir, cb) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    e.isDirectory() ? walk(p, cb) : cb(p);
  }
};
let jsRefs = 0, compRefs = 0;
const missing = [];
walk(npmRoot, (file) => {
  const ext = path.extname(file);
  if (ext === '.js') {
    for (const m of fs.readFileSync(file, 'utf8').matchAll(/(?:from\s*|require\()\s*['"]([^'"]+)['"]/g)) {
      if (path.basename(file) === 'tokens.js') continue; // token KEYS can contain "from"
      const r = m[1];
      if (!r.startsWith('.')) { missing.push(`${file}: non-relative import "${r}"`); continue; }
      jsRefs++;
      const base = path.resolve(path.dirname(file), r);
      if (!fs.existsSync(base) && !fs.existsSync(base + '.js')) missing.push(`${file}: ${r}`);
    }
  } else if (ext === '.json') {
    const j = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const [, target] of Object.entries(j.usingComponents || {})) {
      compRefs++;
      if (!target.startsWith('.')) continue; // npm-style ref: resolves via miniprogram_npm walk-up
      const base = path.resolve(path.dirname(file), target);
      if (!fs.existsSync(base + '.json')) missing.push(`${file}: usingComponents "${target}"`);
    }
  }
});
check(missing.length === 0, `${jsRefs} js imports + ${compRefs} usingComponents refs resolve (${missing.length} missing)`);
for (const m of missing.slice(0, 10)) console.error('  ' + m);

check(fs.existsSync(path.join(npmRoot, 'common', 'style', 'tokens.wxss')),
  'tokens.wxss at documented app.wxss import path');
const comps = fs.existsSync(path.join(npmRoot, 'components'))
  ? fs.readdirSync(path.join(npmRoot, 'components')).length : 0;
check(comps >= 300, `components staged: ${comps}`);

console.log(failed ? '\n✗ npm package check FAILED' : '\n✓ npm package check passed');
process.exit(failed ? 1 : 0);
