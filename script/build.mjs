#!/usr/bin/env node
/**
 * Build script.
 *
 * 1. packages/ui/src -> packages/ui/dist
 *    - copies the 4-piece component files + common/
 *    - inlines the shared style chunks (tokens.wxss, ink/*.wxss) referenced by
 *      each component's wxss, so consumers don't need to import global styles.
 * 2. Scans components' _example/ dirs and regenerates packages/example/pages/
 *    (one demo page per component) + app.json page list.
 *
 * Run: npm run build
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const uiSrc = path.join(root, 'packages/ui/src');
const uiDist = path.join(root, 'packages/ui/dist');
const exampleDir = path.join(root, 'packages/example');
const examplePages = path.join(exampleDir, 'pages');

const COMPONENT_EXTS = ['.js', '.json', '.wxml', '.wxss'];

// ---------------------------------------------------------------------------
// 1. Build packages/ui/dist
// ---------------------------------------------------------------------------

const styleDir = path.join(uiSrc, 'common/style');
const readStyle = (rel) => {
  const p = path.join(styleDir, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
};
const tokensWxss = readStyle('tokens.wxss');

/** Collect /* from <path> ... *\/ comments inside a wxss file. */
function readWxssImports(wxssPath) {
  if (!fs.existsSync(wxssPath)) return [];
  const src = fs.readFileSync(wxssPath, 'utf8');
  const re = /\/\*\s*@ll-import\s+(.+?)\s*\*\//g;
  const chunks = [];
  let m;
  while ((m = re.exec(src))) chunks.push(m[1].trim());
  return chunks;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_example') continue; // demos don't ship in the package
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

fs.rmSync(uiDist, { recursive: true, force: true });
copyDir(uiSrc, uiDist);

// Inline style chunks into every built component wxss.
const componentsDist = path.join(uiDist, 'components');
const components = fs
  .readdirSync(componentsSrc(), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

function componentsSrc() {
  return path.join(uiSrc, 'components');
}

for (const name of components) {
  const wxssPath = path.join(componentsDist, name, `${name}.wxss`);
  if (!fs.existsSync(wxssPath)) continue;
  const imports = readWxssImports(path.join(componentsSrc(), name, `${name}.wxss`));
  if (imports.length === 0) continue;
  const chunks = imports.map((rel) => {
    if (rel === 'tokens') return tokensWxss;
    // "ink/<recipe>" -> common/style/ink/<recipe>.wxss (baked by script/bake-ink.mjs)
    const ink = readStyle(rel.endsWith('.wxss') ? rel : `${rel}.wxss`);
    if (!ink) throw new Error(`Unknown style chunk "${rel}" for component "${name}"`);
    return ink;
  });
  const body = fs.readFileSync(wxssPath, 'utf8').replace(/\/\*\s*@ll-import[\s\S]*?\*\//g, '');
  fs.writeFileSync(wxssPath, chunks.join('\n') + '\n' + body);
}
console.log(`✓ built packages/ui/dist (${components.length} components)`);

// ---------------------------------------------------------------------------
// 1.5. Stage dist into packages/example/miniprogram_npm/@looseleaf/ui
//
// This mirrors what WeChat DevTools "构建 npm" would produce (the package's
// `miniprogram` field maps to dist/), but without requiring a node_modules
// tree — so the example app runs and CI stays simple. usingComponents paths
// like "@looseleaf/ui/components/button/button" resolve against it directly.
// ---------------------------------------------------------------------------

const npmStage = path.join(exampleDir, 'miniprogram_npm', '@looseleaf', 'ui');
fs.rmSync(path.join(exampleDir, 'miniprogram_npm'), { recursive: true, force: true });
fs.mkdirSync(path.dirname(npmStage), { recursive: true });
fs.cpSync(uiDist, npmStage, { recursive: true });
console.log(`✓ staged packages/example/miniprogram_npm/@looseleaf/ui`);

// ---------------------------------------------------------------------------
// 2. Regenerate packages/example/pages from components' _example/
// ---------------------------------------------------------------------------

fs.rmSync(examplePages, { recursive: true, force: true });
fs.mkdirSync(examplePages, { recursive: true });

const pages = [];
for (const name of components) {
  const demoSrc = path.join(componentsSrc(), name, '_example');
  if (!fs.existsSync(demoSrc)) continue;
  const pageDest = path.join(examplePages, name);
  fs.mkdirSync(pageDest, { recursive: true });
  for (const entry of fs.readdirSync(demoSrc)) {
    fs.copyFileSync(path.join(demoSrc, entry), path.join(pageDest, entry));
  }
  // Rewrite the relative usingComponents path ("../<name>") to the npm package.
  const jsonPath = path.join(pageDest, 'index.json');
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  for (const [tag, target] of Object.entries(json.usingComponents ?? {})) {
    json.usingComponents[tag] = target.replace('../', '@looseleaf/ui/components/').replace(/\/$/, '/index');
  }
  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));
  pages.push(`pages/${name}/index`);
}

// Index page listing all components.
fs.mkdirSync(path.join(examplePages, 'index'), { recursive: true });
fs.writeFileSync(
  path.join(examplePages, 'index', 'index.wxml'),
  pages
    .map((p) => {
      const name = p.split('/')[1];
      return `<navigator class="cell" url="/pages/${name}/index">${name}</navigator>`;
    })
    .join('\n'),
);
fs.writeFileSync(
  path.join(examplePages, 'index', 'index.wxss'),
  '.cell { padding: 24rpx 32rpx; border-bottom: 1rpx solid #ddd; }\n',
);
fs.writeFileSync(path.join(examplePages, 'index', 'index.js'), 'Page({});\n');
fs.writeFileSync(path.join(examplePages, 'index', 'index.json'), '{\n  "usingComponents": {}\n}\n');

// app.json with the full page list (index first).
const appJsonPath = path.join(exampleDir, 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
appJson.pages = ['pages/index/index', ...pages.filter((p) => !p.startsWith('pages/index'))];
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');

console.log(`✓ regenerated packages/example (${pages.length + 1} pages)`);
