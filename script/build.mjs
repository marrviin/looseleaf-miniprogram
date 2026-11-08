#!/usr/bin/env node
/**
 * Build script.
 *
 * 1. packages/ui/src -> packages/ui/dist
 *    - copies the 4-piece component files + common/
 *    - inlines the shared ink/*.wxss style chunks referenced by each
 *      component's wxss. tokens.wxss is NOT inlined (it would duplicate ~5KB
 *      into every component and blow the 2MB main-package limit); it ships
 *      once at common/style/tokens.wxss and must be imported once in the
 *      consumer's app.wxss — CSS custom properties inherit into components.
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
  const chunks = imports
    .filter((rel) => {
      // tokens ships once in common/style (imported from app.wxss), never
      // baked per component — see "体积规范" in docs/component-guide.md.
      if (rel === 'tokens') return false;
      return true;
    })
    .map((rel) => {
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
// 1.5. Stage dist into packages/example/miniprogram_npm/looseleaf-miniprogram
//
// This mirrors what WeChat DevTools "构建 npm" would produce (the package's
// `miniprogram` field maps to dist/), but without requiring a node_modules
// tree — so the example app runs and CI stays simple. usingComponents paths
// like "looseleaf-miniprogram/components/button/button" resolve against it
// directly.
// ---------------------------------------------------------------------------

const npmStage = path.join(exampleDir, 'miniprogram_npm', 'looseleaf-miniprogram');
fs.rmSync(path.join(exampleDir, 'miniprogram_npm'), { recursive: true, force: true });
fs.mkdirSync(path.dirname(npmStage), { recursive: true });
fs.cpSync(uiDist, npmStage, { recursive: true });
console.log(`✓ staged packages/example/miniprogram_npm/looseleaf-miniprogram`);

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
    json.usingComponents[tag] = target.replace('../', 'looseleaf-miniprogram/components/').replace(/\/$/, '/index');
  }
  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));
  pages.push(`pages/${name}/index`);
}

// Index page listing all components, grouped like the upstream docs sidebar
// (looseleaf src/docs/core/catalog.ts CATEGORY_ORDER + docs/meta/<slug>.ts
// category/title). Components are grouped by category, groups in upstream
// order, items alphabetically by upstream title — mirroring buildNav.
const CATEGORY_ORDER = [
  'Actions',
  'Forms',
  'Feedback',
  'Overlays',
  'Navigation',
  'Layout',
  'Data display',
  'Charts',
  'Paper',
  'Marks',
  'Stickers & doodles',
  'Chat',
  'Interactive',
  'Typography',
  'Icons',
];
// key = ported component name, value = [category, upstream doc title].
const CATEGORY_OF = {
  button: ['Actions', 'Button'],
  checkbox: ['Forms', 'Checkbox'],
  input: ['Forms', 'Input'],
  'radio-group': ['Forms', 'Radio Group'],
  rating: ['Forms', 'Rating'],
  slider: ['Forms', 'Slider'],
  stepper: ['Forms', 'Stepper'],
  switch: ['Forms', 'Switch'],
  label: ['Forms', 'Label'],
  select: ['Forms', 'Select'],
  field: ['Forms', 'Field'],
  textarea: ['Forms', 'Textarea'],
  empty: ['Feedback', 'Empty'],
  progress: ['Feedback', 'Progress'],
  skeleton: ['Feedback', 'Skeleton'],
  toast: ['Feedback', 'Sonner'],
  spinner: ['Feedback', 'Spinner'],
  dialog: ['Overlays', 'Dialog'],
  'dropdown-menu': ['Overlays', 'Dropdown Menu'],
  popover: ['Overlays', 'Popover'],
  sheet: ['Overlays', 'Sheet'],
  tooltip: ['Overlays', 'Tooltip'],
  card: ['Layout', 'Card'],
  separator: ['Layout', 'Separator'],
  pagination: ['Navigation', 'Pagination'],
  breadcrumb: ['Navigation', 'Breadcrumb'],
  tabs: ['Navigation', 'Tabs'],
  accordion: ['Layout', 'Accordion'],
  item: ['Data display', 'Item'],
  'button-group': ['Actions', 'Button Group'],
  toggle: ['Actions', 'Toggle'],
  'toggle-group': ['Actions', 'Toggle Group'],
  'navigation-menu': ['Navigation', 'Navigation Menu'],
  avatar: ['Data display', 'Avatar'],
  badge: ['Data display', 'Badge'],
  table: ['Data display', 'Table'],
  tag: ['Paper', 'Label tag'],
  paper: ['Paper', 'Paper'],
  'typing-indicator': ['Chat', 'Typing indicator'],
  icon: ['Icons', 'Icon'],
  // D2 — paper small parts
  ribbon: ['Marks', 'Ribbon'],
  seal: ['Stickers & doodles', 'Seal'],
  stamp: ['Stickers & doodles', 'Stamp'],
  sticker: ['Stickers & doodles', 'Sticker'],
  'sticker-sheet': ['Stickers & doodles', 'Sticker sheet'],
  kbd: ['Typography', 'Kbd'],
  'sticky-note': ['Paper', 'Sticky note'],
  napkin: ['Paper', 'Napkin'],
  bookmark: ['Paper', 'Bookmark'],
  ticket: ['Paper', 'Ticket'],
  receipt: ['Paper', 'Receipt'],
  // D10
  alert: ['Feedback', 'Alert'],
  'aspect-ratio': ['Layout', 'Aspect Ratio'],
  carousel: ['Data display', 'Carousel'],
  collapsible: ['Layout', 'Collapsible'],
  'code-block': ['Chat', 'Code block'],
  quote: ['Marks', 'Quote'],
  'typography-h1': ['Typography', 'Typography'],
  arrow: ['Marks', 'Arrow'],
  direction: ['Layout', 'Direction'],
};
const titleCase = (name) =>
  name
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

const groups = new Map();
for (const p of pages) {
  const name = p.split('/')[1];
  const [category, title] = CATEGORY_OF[name] || ['Uncategorized', titleCase(name)];
  if (!groups.has(category)) groups.set(category, []);
  groups.get(category).push({ name, title });
}
const orderedCategories = [
  ...CATEGORY_ORDER.filter((c) => groups.has(c)),
  ...[...groups.keys()].filter((c) => !CATEGORY_ORDER.includes(c)),
];
fs.mkdirSync(path.join(examplePages, 'index'), { recursive: true });
fs.writeFileSync(
  path.join(examplePages, 'index', 'index.wxml'),
  orderedCategories
    .map((category) => {
      const items = groups
        .get(category)
        .sort((a, b) => a.title.localeCompare(b.title, 'en', { numeric: true, sensitivity: 'base' }));
      return [
        `<view class="group">`,
        `  <view class="group-title">${category} <text class="group-count">${items.length}</text></view>`,
        ...items.map(
          (it) => `  <navigator class="cell" url="/pages/${it.name}/index">${it.title}</navigator>`
        ),
        `</view>`,
      ].join('\n');
    })
    .join('\n'),
);
fs.writeFileSync(
  path.join(examplePages, 'index', 'index.wxss'),
  [
    '.group { margin-bottom: 16rpx; }',
    '.group-title { padding: 24rpx 32rpx 8rpx; font-size: 24rpx; font-weight: 700; color: #8a857c; text-transform: uppercase; letter-spacing: 2rpx; }',
    '.group-count { font-weight: 400; color: #b5afa4; }',
    '.cell { display: block; padding: 24rpx 32rpx; border-bottom: 1rpx solid #ddd; }',
  ].join('\n'),
);
fs.writeFileSync(path.join(examplePages, 'index', 'index.js'), 'Page({});\n');
fs.writeFileSync(path.join(examplePages, 'index', 'index.json'), '{\n  "usingComponents": {}\n}\n');

// app.json with the full page list (index first).
const appJsonPath = path.join(exampleDir, 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
appJson.pages = ['pages/index/index', ...pages.filter((p) => p !== 'pages/index/index')];
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');

console.log(`✓ regenerated packages/example (${pages.length + 1} pages)`);
