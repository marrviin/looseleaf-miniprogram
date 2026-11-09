#!/usr/bin/env node
/**
 * L3 — WeChat DevTools automation smoke + screenshot capture.
 *
 * Drives the real runtime over the generated example app: navigates every
 * page (demos + stress fixtures), records console errors, screenshots each
 * page for the L4 visual regression.
 *
 * Prereqs (local machine — DevTools cannot run on the ubuntu CI pool):
 *   1. WeChat DevTools installed; CLI automation enabled in its settings
 *      (设置 → 安全设置 → 服务端口).
 *   2. `npm run build` first (stages dist into packages/example).
 *      NEVER use the IDE's "构建 npm" — it recreates miniprogram_npm and
 *      blows the 80051 size limit.
 *
 *   node script/automator-smoke.mjs --device iphone15pro [--stress-only] [--pages a,b]
 *
 * Env:
 *   WECHAT_DEVTOOLS_CLI  cli binary (default macOS path below)
 *   LL_ALLOW_ERRORS      regex; console errors matching it are ignored
 *
 * Output: test-artifacts/automator/<device>/<page>.png + summary.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import automator from 'miniprogram-automator';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const exampleDir = path.join(root, 'packages/example');
const outDir = path.join(root, 'test-artifacts/automator');

// --- args -------------------------------------------------------------------
const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : null;
};
const hasFlag = (name) => argv.includes(`--${name}`);
const device = arg('device') || 'iphone15pro';
const stressOnly = hasFlag('stress-only');
const pagesFilter = arg('pages') ? arg('pages').split(',') : null;

// --- pages ------------------------------------------------------------------
const appJson = JSON.parse(fs.readFileSync(path.join(exampleDir, 'app.json'), 'utf8'));
const subpackages = appJson.subpackages ?? appJson.subPackages ?? [];
const pages = [
  ...appJson.pages.map((p) => `/${p}`),
  ...subpackages.flatMap((s) => s.pages.map((p) => `/${s.root}/${p}`)),
].filter((p) => (stressOnly ? p.includes('-stress') : true))
 .filter((p) => (pagesFilter ? pagesFilter.some((f) => p.includes(f)) : true))
 .sort();

const devtoolsCli =
  process.env.WECHAT_DEVTOOLS_CLI ||
  '/Applications/wechatwebdevtools.app/Contents/MacOS/cli';

if (!fs.existsSync(devtoolsCli)) {
  console.error(`✗ DevTools CLI not found at ${devtoolsCli}`);
  console.error('  install WeChat DevTools or set WECHAT_DEVTOOLS_CLI');
  process.exit(2);
}

const shotDir = path.join(outDir, device);
fs.mkdirSync(shotDir, { recursive: true });

console.log(`launching DevTools (${device}) over packages/example, ${pages.length} pages…`);
const miniProgram = await automator.launch({
  cliPath: devtoolsCli,
  projectPath: exampleDir,
  // project.config.json pins appid/setting; automation port is chosen by CLI.
});

const allowRe = process.env.LL_ALLOW_ERRORS ? new RegExp(process.env.LL_ALLOW_ERRORS) : null;
const results = [];
let consoleErrors = [];

// Errors bubble through one handler; tag them with the page being visited.
let currentPage = '';
miniProgram.on('console', (msg) => {
  if (msg.type !== 'error' && msg.type !== 'exception') return;
  const text = (msg.args ?? []).map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  if (allowRe && allowRe.test(text)) return;
  consoleErrors.push({ page: currentPage, text: text.slice(0, 500) });
});

for (const page of pages) {
  currentPage = page;
  const entry = { page, ok: true };
  try {
    await miniProgram.reLaunch(page);
    await new Promise((r) => setTimeout(r, 800)); // let ink layers + fonts settle
    const shot = path.join(shotDir, `${page.replace(/^\//, '').replace(/\//g, '__')}.png`);
    await miniProgram.screenshot({ path: shot });
    entry.screenshot = path.relative(root, shot);
  } catch (e) {
    entry.ok = false;
    entry.error = String(e.message || e).slice(0, 300);
  }
  results.push(entry);
  process.stdout.write(entry.ok ? '.' : `\n✗ ${page}: ${entry.error}\n`);
}

const summary = { device, pages: results.length, failed: results.filter((r) => !r.ok).length, consoleErrors, results };
fs.writeFileSync(path.join(shotDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');

console.log(`\n${summary.failed}/${results.length} pages failed, ${consoleErrors.length} console error(s)`);
console.log(`screenshots → ${path.relative(root, shotDir)}`);

await miniProgram.disconnect();
process.exit(summary.failed > 0 || consoleErrors.length > 0 ? 1 : 0);
