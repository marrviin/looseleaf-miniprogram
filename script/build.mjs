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

// Demo pages not worth porting: kbd renders keyboard-key chips — no physical
// keyboard on a phone, so the component is API-only here (still staged because
// command-shortcut / dropdown-menu-shortcut render ll-kbd internally).
const DEMO_SKIP = new Set(['kbd']);

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

// Stage the publish-facing docs next to packages/ui/package.json — npm packs
// README.md and LICENSE from the package root automatically, and without them
// the npmjs page would be empty and license-less.
for (const doc of ['README.md', 'README.en.md', 'LICENSE']) {
  fs.copyFileSync(path.join(root, doc), path.join(root, 'packages/ui', doc));
}
console.log('✓ staged README.md / README.en.md / LICENSE into packages/ui');

// ---------------------------------------------------------------------------
// 1.5. Stage dist into the example as subpackages.
//
// The whole library (~2.6MB uploaded) cannot ship in the main package —
// WeChat caps every package at 2MB on upload (error 80051), and npm build
// output can only land in the main package. So instead of miniprogram_npm
// the example stages dist/ directly:
//
//   common/                          → example/common          (main package)
//   components used by >1 cluster    → example/components      (main package)
//   cluster-exclusive components     → example/<pkgRoot>/<name>/
//   demo pages                       → example/<pkgRoot>/pages/<name>/
//
// Component dirs keep the dist shape <name>/<name>.* directly under a
// package root, so the "../../common/..." requires still resolve without
// rewriting. usingComponents refs are rewritten to root-absolute paths
// ("/components/x/x", "/pkg-forms/x/x") — subpackage pages may reference
// main-package components natively, no async placeholder needed.
// ---------------------------------------------------------------------------

fs.rmSync(path.join(exampleDir, 'miniprogram_npm'), { recursive: true, force: true }); // legacy layout

// category cluster → subpackage root. Categories that lean on each other's
// components share a package; every package must stay under 2MB raw.
const CLUSTERS = [
  ['pkg-forms', ['Forms', 'Actions', 'Layout']],
  ['pkg-feedback', ['Feedback', 'Overlays']],
  ['pkg-data', ['Data display', 'Charts', 'Navigation', 'Typography', 'Icons', 'Chat']],
  ['pkg-paper', ['Paper', 'Marks']],
  ['pkg-interactive', ['Interactive', 'Stickers & doodles']],
];
const PKG_ROOT_OF_CATEGORY = Object.fromEntries(
  CLUSTERS.flatMap(([root, categories]) => categories.map((c) => [c, root])),
);

// key = ported component name, value = [category, upstream doc title]
// (upstream: src/docs/core/catalog.ts CATEGORY_ORDER + docs/meta/<slug>.ts;
// upstream slugs differ for toast→sonner, tag→label-tag, typography-h1→typography).
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
  sidebar: ['Navigation', 'Sidebar'],
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
  // Full upstream category sync (src/docs/meta/<slug>.ts; the port renamed
  // sonner→toast, label-tag→tag, typography→typography-h1).
  'alert-dialog': ['Overlays', 'Alert Dialog'],
  annotate: ['Marks', 'Annotate'],
  asterisk: ['Marks', 'Asterisk'],
  attachment: ['Chat', 'Attachment'],
  bracket: ['Marks', 'Bracket'],
  bubble: ['Chat', 'Bubble'],
  calendar: ['Forms', 'Calendar'],
  callout: ['Marks', 'Callout'],
  chart: ['Charts', 'Chart'],
  circled: ['Marks', 'Circled'],
  clipboard: ['Paper', 'Clipboard'],
  combobox: ['Forms', 'Combobox'],
  command: ['Overlays', 'Command'],
  confetti: ['Interactive', 'Confetti'],
  'context-menu': ['Overlays', 'Context Menu'],
  corkboard: ['Interactive', 'Corkboard'],
  'date-picker': ['Forms', 'Date Picker'],
  desk: ['Paper', 'Desk'],
  doodle: ['Stickers & doodles', 'Doodle'],
  drawer: ['Overlays', 'Drawer'],
  dropzone: ['Forms', 'Dropzone'],
  envelope: ['Paper', 'Envelope'],
  'flip-card': ['Interactive', 'Flip Card'],
  folder: ['Paper', 'Folder'],
  form: ['Forms', 'Form'],
  handwritten: ['Typography', 'Handwritten'],
  lettering: ['Typography', 'Lettering'],
  highlight: ['Marks', 'Highlight'],
  'hover-card': ['Overlays', 'Hover Card'],
  'index-card': ['Paper', 'Index Card'],
  'input-group': ['Forms', 'Input Group'],
  'input-otp': ['Forms', 'Input Otp'],
  marker: ['Chat', 'Marker'],
  marquee: ['Interactive', 'Marquee'],
  mascot: ['Stickers & doodles', 'Mascot'],
  menubar: ['Navigation', 'Menubar'],
  message: ['Chat', 'Message'],
  'message-scroller': ['Chat', 'Message Scroller'],
  'native-select': ['Forms', 'Native Select'],
  notebook: ['Paper', 'Notebook'],
  page: ['Paper', 'Page'],
  polaroid: ['Paper', 'Polaroid'],
  'prompt-input': ['Chat', 'Prompt Input'],
  reveal: ['Interactive', 'Reveal'],
  scribble: ['Marks', 'Scribble'],
  signature: ['Marks', 'Signature'],
  'signature-pad': ['Forms', 'Signature Pad'],
  sketchpad: ['Interactive', 'Sketchpad'],
  squiggle: ['Marks', 'Squiggle'],
  'stamp-button': ['Actions', 'Stamp Button'],
  'sticker-board': ['Interactive', 'Sticker Board'],
  'sticker-picker': ['Forms', 'Sticker Picker'],
  strike: ['Marks', 'Strike'],
  tape: ['Paper', 'Tape'],
  'tear-off': ['Interactive', 'Tear Off'],
  typewriter: ['Typography', 'Typewriter'],
  underline: ['Marks', 'Underline'],
};

// Where each component ends up: 'main' when several clusters need it,
// otherwise the single cluster's subpackage root. Comps no demo page reaches
// are not staged at all (the uploader's dependency analysis would drop them
// anyway — this just keeps the repo copy honest too).
const compHome = new Map(); // comp name → 'main' | pkgRoot
{
  const compDeps = new Map(); // comp name → Set(comp names), from built json
  const refsOf = (dir, base) => {
    const json = JSON.parse(fs.readFileSync(path.join(dir, `${base}.json`), 'utf8'));
    const names = new Set();
    for (const target of Object.values(json.usingComponents ?? {})) {
      const m = target.match(/components\/([\w-]+)\//) ?? target.match(/\.\.\/([\w-]+)\//);
      if (m) names.add(m[1]);
    }
    return names;
  };
  for (const name of components) {
    const dir = path.join(uiDist, 'components', name);
    if (fs.existsSync(path.join(dir, `${name}.json`))) compDeps.set(name, refsOf(dir, name));
  }
  const closureOf = (names) => {
    const out = new Set();
    const stack = [...names];
    while (stack.length) {
      const c = stack.pop();
      if (out.has(c)) continue;
      out.add(c);
      for (const d of compDeps.get(c) ?? []) stack.push(d);
    }
    return out;
  };

  const usage = new Map(); // comp → Set(pkgRoot)
  const noteUsage = (comp, root) => {
    if (!usage.has(comp)) usage.set(comp, new Set());
    usage.get(comp).add(root);
  };
  for (const name of components) {
    const demoSrc = path.join(componentsSrc(), name, '_example');
    if (!fs.existsSync(demoSrc) || DEMO_SKIP.has(name)) continue;
    const root = PKG_ROOT_OF_CATEGORY[CATEGORY_OF[name]?.[0]];
    if (!root) throw new Error(`No category/cluster for component "${name}" — add it to CATEGORY_OF`);
    for (const c of closureOf(refsOf(demoSrc, 'index'))) noteUsage(c, root);
  }
  // The landing page (pages/index, generated below) renders the component
  // catalog with the sidebar family — count it as a main-package root so
  // the catalog components stage into main (a main-package page cannot
  // reference another package's components).
  for (const c of closureOf([
    'sidebar-provider',
    'sidebar',
    'sidebar-content',
    'sidebar-group',
    'sidebar-group-content',
    'sidebar-menu',
    'sidebar-menu-item',
    'sidebar-menu-button',
    'sidebar-menu-sub',
    'sidebar-menu-sub-item',
    'sidebar-menu-sub-button',
    'collapsible',
    'collapsible-trigger',
    'collapsible-content',
    'collapsible-indicator',
  ])) {
    noteUsage(c, 'main');
  }
  // The custom tab bar renders the tabs family (default variant) — same rule.
  for (const c of closureOf(['tabs', 'tabs-list', 'tabs-trigger'])) noteUsage(c, 'main');
  for (const [comp, roots] of usage) {
    compHome.set(comp, roots.size > 1 ? 'main' : [...roots][0]);
  }
  const orphans = components.filter((c) => !usage.has(c));
  if (orphans.length) {
    console.warn(`⚠ unreferenced components (not staged): ${orphans.join(', ')}`);
  }
}

const compTargetDir = (comp) =>
  compHome.get(comp) === 'main'
    ? path.join(exampleDir, 'components', comp)
    : path.join(exampleDir, compHome.get(comp), comp);
const compRef = (comp) =>
  compHome.get(comp) === 'main'
    ? `/components/${comp}/${comp}`
    : `/${compHome.get(comp)}/${comp}/${comp}`;

/** Rewrite one usingComponents value (npm-style or ../relative) to root-absolute. */
const rewriteCompRef = (target) => {
  const m = target.match(/components\/([\w-]+)\//) ?? target.match(/\.\.\/([\w-]+)\//);
  if (!m || !compHome.has(m[1])) {
    throw new Error(`Cannot map usingComponents target "${target}" to a staged package`);
  }
  return compRef(m[1]);
};

// Clean generated trees, then stage common + components.
for (const [root] of CLUSTERS) fs.rmSync(path.join(exampleDir, root), { recursive: true, force: true });
fs.rmSync(path.join(exampleDir, 'components'), { recursive: true, force: true });
fs.rmSync(path.join(examplePages), { recursive: true, force: true });

fs.cpSync(path.join(uiDist, 'common'), path.join(exampleDir, 'common'), { recursive: true });
for (const comp of compHome.keys()) {
  const dest = compTargetDir(comp);
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(path.join(uiDist, 'components', comp))) {
    if (entry.endsWith('.md')) continue;
    fs.copyFileSync(path.join(uiDist, 'components', comp, entry), path.join(dest, entry));
  }
  const jsonPath = path.join(dest, `${comp}.json`);
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  for (const [tag, target] of Object.entries(json.usingComponents ?? {})) {
    json.usingComponents[tag] = rewriteCompRef(target);
  }
  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2) + '\n');
}
console.log(`✓ staged common + ${compHome.size} components (main: ${[...compHome.values()].filter((h) => h === 'main').length})`);

// Cross-package require patch. A component's JS may import a sibling
// component's module (`pagination-link/props.js` imports
// `../button/type`); the bundler resolves that relative to the package
// root, so when the two components stage into different packages the
// module dies at runtime (lib 3.18.0 no longer inlines the target).
// Copy the missing module files into the package — transitively; main
// package targets (`../../common/…`, a main-package sibling) need
// nothing. json usingComponents refs are root-absolute and unaffected,
// so the duplicated files are module sources only.
const relImportsOf = (file) =>
  [...fs.readFileSync(file, 'utf8').matchAll(/['"]\.\.\/([\w-]+)\/([\w./-]+)['"]/g)].map((m) => ({
    comp: m[1],
    file: m[2],
  }));
let patchedRequires = 0;
for (const [root] of CLUSTERS) {
  const pkgDir = path.join(exampleDir, root);
  if (!fs.existsSync(pkgDir)) continue;
  const seen = new Set();
  const copyModule = (comp, file) => {
    // import specifiers are extensionless (`'../button/type'`); the file
    // on disk is the .js
    const rel = `${comp}/${/\.\w+$/.test(file) ? file : `${file}.js`}`;
    if (seen.has(rel)) return;
    seen.add(rel);
    const src = path.join(uiDist, 'components', rel);
    const dest = path.join(pkgDir, rel);
    if (fs.existsSync(dest) || !fs.existsSync(src)) return;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    patchedRequires++;
    for (const next of relImportsOf(src)) copyModule(next.comp, next.file);
  };
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(fp);
      else if (entry.name.endsWith('.js')) {
        for (const imp of relImportsOf(fp)) copyModule(imp.comp, imp.file);
      }
    }
  };
  walk(pkgDir);
}
if (patchedRequires) console.log(`✓ copied ${patchedRequires} cross-package require targets into their packages`);

// ---------------------------------------------------------------------------
// 2. Regenerate demo pages into their cluster's subpackage + the index page
// ---------------------------------------------------------------------------

fs.mkdirSync(path.join(examplePages, 'index'), { recursive: true });

const pageRootOf = {}; // demo comp → subpackage root
const pagesByRoot = new Map(CLUSTERS.map(([root]) => [root, []]));
for (const name of components) {
  const demoSrc = path.join(componentsSrc(), name, '_example');
  if (!fs.existsSync(demoSrc) || DEMO_SKIP.has(name)) continue;
  const root = PKG_ROOT_OF_CATEGORY[CATEGORY_OF[name]?.[0]];
  const pageDest = path.join(exampleDir, root, 'pages', name);
  fs.mkdirSync(pageDest, { recursive: true });
  for (const entry of fs.readdirSync(demoSrc)) {
    const src = path.join(demoSrc, entry);
    const dest = path.join(pageDest, entry);
    if (entry === 'index.js') {
      // Detail pages open on the cream paper stock (app.wxss page root), not
      // the catalog desk — give them a matching nav bar instead of app.json's
      // green. Page json "window" is NOT applied to Component-built pages
      // (verified: only app.json's color ever shows), so wrap the demo's
      // Component() call and paint the nav on every show.
      const body = fs.readFileSync(src, 'utf8');
      const injected = `/* injected by build.mjs — cream nav to match the paper page root
   (page.json "window" does not reach Component-built pages). */\n;(function () {\n  var C = Component;\n  Component = function (opts) {\n    opts = opts || {};\n    opts.methods = opts.methods || {};\n    var prev = opts.methods.onShow;\n    opts.methods.onShow = function () {\n      var self = this, args = arguments;\n      setTimeout(function () {\n        wx.setNavigationBarColor({\n          frontColor: '#000000',\n          backgroundColor: '#f8f5ee',\n          fail: function (e) { console.error('[cream-nav] fail', e && e.errMsg); },\n        });\n      }, 0);\n      return prev && prev.apply(self, args);\n    };\n    return C.call(this, opts);\n  };\n})();\n`;
      fs.writeFileSync(dest, injected + body);
    } else {
      fs.copyFileSync(src, dest);
    }
  }
  const jsonPath = path.join(pageDest, 'index.json');
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  for (const [tag, target] of Object.entries(json.usingComponents ?? {})) {
    json.usingComponents[tag] = rewriteCompRef(target);
  }
  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2) + '\n');
  pageRootOf[name] = root;
  pagesByRoot.get(root).push(name);
}

const titleCase = (name) =>
  name
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

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
const groups = new Map();
for (const name of Object.keys(pageRootOf)) {
  const [category, title] = CATEGORY_OF[name] || [undefined, titleCase(name)];
  if (!groups.has(category)) groups.set(category, []);
  groups.get(category).push({ name, title });
}
const orderedCategories = [
  ...CATEGORY_ORDER.filter((c) => groups.has(c)),
  ...[...groups.keys()].filter((c) => !CATEGORY_ORDER.includes(c)),
];
// Category menu: the sidebar pad IS the page — a full-width docked paper
// (`static`, so the binder clip hangs on the top edge half outside),
// "Components" + total up top, then each
// category as a collapsible row (chevron + blue count) opening into the
// menu-sub pencil-line list. A sub row navigates to its demo page and
// stays marked with the highlighter when you come back.
const menuSlug = (category) => category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const catalogCats = orderedCategories.map((category) => {
  const items = groups
    .get(category)
    .sort((a, b) => a.title.localeCompare(b.title, 'en', { numeric: true, sensitivity: 'base' }))
    .map((it) => ({ name: it.name, title: it.title, url: `/${pageRootOf[it.name]}/pages/${it.name}/index` }));
  return { name: category, slug: menuSlug(category), items };
});
const totalComps = catalogCats.reduce((n, c) => n + c.items.length, 0);
// Tab pages call getTabBar().sync() on show — shared by the landing + about pages.
const syncTabBar = [
  `  onShow() {`,
  `    const t = typeof this.getTabBar === 'function' && this.getTabBar();`,
  `    if (t) t.sync();`,
  `  },`,
];
fs.writeFileSync(
  path.join(examplePages, 'index', 'index.wxml'),
  [
    `<view class="desk">`,
    `  <view class="desk-frame">`,
    `    <ll-sidebar-provider custom-style="min-height:0;height:100%;">`,
    `      <ll-sidebar static paper-shadow="none" seed="catalog" custom-style="width:100%;height:100%;--sidebar-width:100%;">`,
    `    <view class="catalog-head">`,
    `      <text class="head-kicker">Components</text>`,
    `      <text class="head-count">{{total}}</text>`,
    `    </view>`,
    `    <ll-sidebar-content>`,
    `      <ll-sidebar-group>`,
    `        <ll-sidebar-group-content>`,
    `          <ll-sidebar-menu>`,
    `            <block wx:for="{{cats}}" wx:key="slug" wx:for-item="cat" wx:for-index="ci">`,
    `              <ll-collapsible default-open="{{ci === 0}}">`,
    `                <ll-sidebar-menu-item>`,
    `                  <ll-collapsible-trigger>`,
    `                    <ll-sidebar-menu-button>`,
    `                      <ll-collapsible-indicator />`,
    `                      <text class="ell">{{cat.name}}</text>`,
    `                      <text class="cat-count">{{cat.items.length}}</text>`,
    `                    </ll-sidebar-menu-button>`,
    `                  </ll-collapsible-trigger>`,
    `                  <ll-collapsible-content>`,
    `                    <ll-sidebar-menu-sub>`,
    `                      <ll-sidebar-menu-sub-item wx:for="{{cat.items}}" wx:key="name" wx:for-item="item">`,
    `                        <ll-sidebar-menu-sub-button is-active="{{item.url === activeUrl}}" data-url="{{item.url}}" bind:tap="onPick">`,
    `                          <text class="ell sub-label">{{item.title}}</text>`,
    `                        </ll-sidebar-menu-sub-button>`,
    `                      </ll-sidebar-menu-sub-item>`,
    `                    </ll-sidebar-menu-sub>`,
    `                  </ll-collapsible-content>`,
    `                </ll-sidebar-menu-item>`,
    `              </ll-collapsible>`,
    `            </block>`,
    `          </ll-sidebar-menu>`,
    `        </ll-sidebar-group-content>`,
    `      </ll-sidebar-group>`,
    `    </ll-sidebar-content>`,
    `      </ll-sidebar>`,
    `    </ll-sidebar-provider>`,
    `  </view>`,
    `</view>`,
  ].join('\n'),
);
fs.writeFileSync(
  path.join(examplePages, 'index', 'index.wxss'),
  [
    '/* catalog — the sidebar pad floats on the upstream docs desk (sage linen). */',
    '/* The page root is desk-green too: app.wxss paints every page root as',
    '   cream paper stock, and the .desk view painted over it late enough to',
    '   flash cream on open. First paint is the desk itself. */',
    'page {',
    '  background-color: var(--ll-desk, #a8c8bb);',
    '  background-image: var(--ll-tex-linen);',
    '  background-size: 160px 160px;',
    '  background-repeat: repeat;',
    '}',
    '.desk {',
    '  /* 40px = the custom tab bar (ll-tabs-list height:80rpx, tabs-list.wxss). */',
    '  height: calc(100vh - 40px - env(safe-area-inset-bottom));',
    '  box-sizing: border-box;',
    '  /* top padding also gives the binder-clip handles room (fastener draws',
    '     40px above the pad top edge) */',
    '  padding: 48rpx 20rpx 20rpx;',
    '  background-color: var(--ll-desk, #a8c8bb);',
    '  background-image: var(--ll-tex-linen);',
    '  background-size: 160px 160px;',
    '  background-repeat: repeat;',
    '}',
    '.desk-frame { position: relative; height: 100%; }',
    '.catalog-head {',
    '  display: flex;',
    '  align-items: baseline;',
    '  justify-content: space-between;',
    '  padding: 8rpx 24rpx 8rpx;',
    '}',
    '.head-kicker {',
    "  font-family: 'IBM Plex Mono', Menlo, monospace;",
    '  font-size: 23rpx;',
    '  letter-spacing: 1rpx;',
    '  color: #4a433c;',
    '}',
    '.head-count {',
    "  font-family: 'IBM Plex Mono', Menlo, monospace;",
    '  font-size: 30rpx;',
    '  color: #2c4f9e;',
    '}',
    '.cat-count {',
    "  font-family: 'IBM Plex Mono', Menlo, monospace;",
    '  font-size: 26rpx;',
    '  color: #2c4f9e;',
    '}',
  ].join('\n'),
);
fs.writeFileSync(
  path.join(examplePages, 'index', 'index.js'),
  [
    `Page({`,
    `  data: { cats: ${JSON.stringify(catalogCats)}, total: ${totalComps}, activeUrl: '' },`,
    ...syncTabBar,
    `  // a sub row navigates to its demo page and keeps the highlighter on return`,
    `  onPick(e) {`,
    `    const url = e.currentTarget.dataset.url;`,
    `    if (!url) return;`,
    `    this.setData({ activeUrl: url });`,
    `    wx.navigateTo({ url, fail: () => wx.switchTab({ url }) });`,
    `  },`,
    `});`,
    '',
  ].join('\n'),
);
fs.writeFileSync(
  path.join(examplePages, 'index', 'index.json'),
  JSON.stringify(
    {
      usingComponents: {
        'll-sidebar-provider': compRef('sidebar-provider'),
        'll-sidebar': compRef('sidebar'),
        'll-sidebar-content': compRef('sidebar-content'),
        'll-sidebar-group': compRef('sidebar-group'),
        'll-sidebar-group-content': compRef('sidebar-group-content'),
        'll-sidebar-menu': compRef('sidebar-menu'),
        'll-sidebar-menu-item': compRef('sidebar-menu-item'),
        'll-sidebar-menu-button': compRef('sidebar-menu-button'),
        'll-sidebar-menu-sub': compRef('sidebar-menu-sub'),
        'll-sidebar-menu-sub-item': compRef('sidebar-menu-sub-item'),
        'll-sidebar-menu-sub-button': compRef('sidebar-menu-sub-button'),
        'll-collapsible': compRef('collapsible'),
        'll-collapsible-trigger': compRef('collapsible-trigger'),
        'll-collapsible-content': compRef('collapsible-content'),
        'll-collapsible-indicator': compRef('collapsible-indicator'),
      },
    },
    null,
    2,
  ) + '\n',
);

// About tab — project intro as two ll-cards (upstream web / this port) on the
// docs desk (tabBar pages must live in main).
fs.mkdirSync(path.join(examplePages, 'about'), { recursive: true });
fs.writeFileSync(
  path.join(examplePages, 'about', 'index.wxml'),
  [
    '<view class="about-page">',
    '  <ll-card seed="about-upstream">',
    '    <ll-card-header>',
    '      <ll-card-title custom-style="font-size:34rpx">Looseleaf</ll-card-title>',
    '      <ll-card-description>a shadcn/ui edition, hand-drawn · Web</ll-card-description>',
    '    </ll-card-header>',
    '    <ll-card-content class="about-content">',
    '      <view class="about-desc">A shadcn/ui-flavored paper UI kit that draws its ink strokes at runtime — crooked borders, wobbly underlines, paper textures and tape, like handwriting UI on a sticky note.</view>',
    '      <view class="about-row"><text class="about-label">Stack</text><text class="about-value">React + Tailwind, reusing shadcn/ui component semantics</text></view>',
    '      <view class="about-row"><text class="about-label">System</text><text class="about-value">paper / ink / palette / density tokens + handwritten fonts</text></view>',
    '      <view class="about-row"><text class="about-label">Author</text><text class="about-value">kevintngo</text></view>',
    '    </ll-card-content>',
    '    <ll-card-footer rule="dashed" custom-style="justify-content:flex-start">',
    '      <text class="about-link">github.com/kevintngo/looseleaf</text>',
    '    </ll-card-footer>',
    '  </ll-card>',
    '  <ll-card seed="about-port" tape="corner" custom-style="margin-top:40rpx">',
    '    <ll-card-header>',
    '      <ll-card-title custom-style="font-size:34rpx">Looseleaf Miniprogram</ll-card-title>',
    '      <ll-card-description>微信小程序移植版 · 原生实现</ll-card-description>',
    '    </ll-card-header>',
    '    <ll-card-content class="about-content">',
    '      <view class="about-desc">无 WebView、无跨端框架，纯 WXML + WXSS + Component 实现，组件统一以 ll- 为前缀。</view>',
    '      <view class="about-row"><text class="about-label">墨迹</text><text class="about-value">笔画按元素真实尺寸逐个绘制，每个实例都是独一无二的手迹</text></view>',
    '      <view class="about-row"><text class="about-label">组件</text><text class="about-value">{{total}} 个，按 {{cats}} 类组织，API 与上游一一对应</text></view>',
    '      <view class="about-row"><text class="about-label">作者</text><text class="about-value">marrviin</text></view>',
    '    </ll-card-content>',
    '    <ll-card-footer rule="dashed" custom-style="justify-content:flex-start">',
    '      <text class="about-link">github.com/marrviin/looseleaf-miniprogram</text>',
    '    </ll-card-footer>',
    '  </ll-card>',
    '</view>',
  ].join('\n'),
);
fs.writeFileSync(
  path.join(examplePages, 'about', 'index.wxss'),
  [
    '/* about — two ll-cards (upstream web / this port) on the docs desk. */',
    '/* Same frame as the catalog desk (pages/index .desk): the content area',
    '   ends at the tab bar top (40px + safe area) and scrolls inside, so the',
    '   cards clip 20rpx above the bar like the pad does — never slide under it. */',
    '/* The container no longer covers the full viewport, so paint the page',
    '   itself desk-green too — the app default cream paper would show below. */',
    'page {',
    '  height: 100%;',
    '  background-color: var(--ll-desk, #a8c8bb);',
    '  background-image: var(--ll-tex-linen);',
    '  background-size: 160px 160px;',
    '  background-repeat: repeat;',
    '}',
    '.about-page {',
    '  height: calc(100vh - 40px - env(safe-area-inset-bottom));',
    '  padding: 96rpx 40rpx 20rpx;',
    '  box-sizing: border-box;',
    '  overflow-y: auto;',
    '  background-color: var(--ll-desk, #a8c8bb);',
    '  background-image: var(--ll-tex-linen);',
    '  background-size: 160px 160px;',
    '  background-repeat: repeat;',
    '}',
    '.about-content { display: flex; flex-direction: column; gap: 20rpx; }',
    '.about-desc { font-size: 26rpx; line-height: 1.7; color: #3a352e; }',
    '.about-row { display: flex; gap: 20rpx; }',
    ".about-label { flex-shrink: 0; font-family: 'Kevin Sans', sans-serif; font-size: 26rpx; font-weight: 600; color: #2a2420; }",
    '.about-value { font-size: 26rpx; line-height: 1.6; color: #3a352e; }',
    '.about-link { font-size: 24rpx; line-height: 1.6; color: #3a5a48; text-decoration: underline; }',
  ].join('\n'),
);
fs.writeFileSync(
  path.join(examplePages, 'about', 'index.js'),
  [`Page({`, `  data: { total: ${totalComps}, cats: ${catalogCats.length} },`, ...syncTabBar, `});`, ''].join('\n'),
);
fs.writeFileSync(
  path.join(examplePages, 'about', 'index.json'),
  JSON.stringify(
    {
      usingComponents: {
        'll-card': '/components/card/card',
        'll-card-header': '/components/card-header/card-header',
        'll-card-title': '/components/card-title/card-title',
        'll-card-description': '/components/card-description/card-description',
        'll-card-content': '/components/card-content/card-content',
        'll-card-footer': '/components/card-footer/card-footer',
      },
    },
    null,
    2,
  ) + '\n',
);

// Custom tab bar — the native one can't paint ink skeletons, so the bar is a
// main-package custom-tab-bar built from the library's own tabs family
// (default variant: the active tab lifts and fills with highlighter) with
// ll-icon inside each trigger.
fs.mkdirSync(path.join(exampleDir, 'custom-tab-bar'), { recursive: true });
const TABS = [
  { key: 'home', icon: 'layout-grid', text: 'Components', url: '/pages/index/index' },
  { key: 'about', icon: 'info', text: 'About', url: '/pages/about/index' },
];
fs.writeFileSync(
  path.join(exampleDir, 'custom-tab-bar', 'index.js'),
  [
    `// Tab defs mirror app.json's tabBar.list; highlight follows the route so`,
    `// every tab page just calls getTabBar().sync() in onShow.`,
    `const TABS = ${JSON.stringify(TABS)};`,
    ``,
    `Component({`,
    `  data: { tabs: TABS, selected: 'home' },`,
    `  lifetimes: {`,
    `    attached() {`,
    `      // each tab page owns a bar instance — start it from the real route`,
    `      // so it never paints the wrong highlight before the first onShow`,
    `      this.sync();`,
    `    },`,
    `  },`,
    `  methods: {`,
    `    sync() {`,
    `      const pages = getCurrentPages();`,
    `      const cur = pages[pages.length - 1];`,
    `      if (!cur) return;`,
    `      const cur2 = this.data.tabs.find((t) => t.url === '/' + cur.route);`,
    `      if (!cur2) return;`,
    `      // unconditional: a tap on this instance already moved ll-tabs'`,
    `      // internal current — same-value setData still fires the observer,`,
    `      // which re-adopts the route's key and re-syncs every trigger.`,
    `      this.setData({ selected: cur2.key });`,
    `    },`,
    `    // ll-tabs change → switchTab; the destination page's onShow → sync()`,
    `    // re-highlights from the route (each tab page owns a bar instance).`,
    `    onTabsChange(e) {`,
    `      const t = this.data.tabs.find((t) => t.key === e.detail.value);`,
    `      if (t) wx.switchTab({ url: t.url });`,
    `    },`,
    `  },`,
    `});`,
    '',
  ].join('\n'),
);
fs.writeFileSync(
  path.join(exampleDir, 'custom-tab-bar', 'index.wxml'),
  [
    `<view class="tabbar">`,
    `  <ll-tabs value="{{selected}}" bind:change="onTabsChange">`,
    `    <!-- overflow:hidden kills the list's own overflow-x:auto scroller;`,
    `         baseline=false drops the pencil baseline (bottom-nav look) -->`,
    `    <ll-tabs-list baseline="{{false}}" custom-style="width:100%;overflow:hidden;">`,
    `      <!-- padding:0 — the trigger ships with 4rpx bottom padding (to sit`,
    `           ON the baseline); without the line, center it truly -->`,
    `      <ll-tabs-trigger wx:for="{{tabs}}" wx:key="key" value="{{item.key}}" aria-label="{{item.text}}" custom-style="padding:0;">`,
    `        <!-- fixed ink: a bound ink regenerates the icon's data URI on`,
    `             every switch (draw + decode = the tap flicker); the demo`,
    `             icons keep one ink and let the trigger text color move -->`,
    `        <ll-icon name="{{item.icon}}" size="{{16}}" />`,
    `        {{item.text}}`,
    `      </ll-tabs-trigger>`,
    `    </ll-tabs-list>`,
    `  </ll-tabs>`,
    `</view>`,
  ].join('\n'),
);
// The bar paints the desk stock the docs pages sit on (sage linen, the
// --ll-desk surface). page-level CSS vars do NOT reach custom-tab-bar (WeChat
// renders it in a separate root), so the stock is inlined here — extracted at
// build time from the baked chunks to stay in sync (a full @import of
// paper-tiles.wxss would duplicate all ~170KB).
const tilesWxss = fs.readFileSync(path.join(exampleDir, 'common', 'style', 'paper-tiles.wxss'), 'utf8');
const tileVar = (name) => {
  const m = tilesWxss.match(new RegExp(`^  --ll-tex-${name}: (.+);$`, 'm'));
  if (!m) throw new Error(`--ll-tex-${name} not found in paper-tiles.wxss`);
  return m[1];
};
const tokensWxss = fs.readFileSync(path.join(exampleDir, 'common', 'style', 'tokens.wxss'), 'utf8');
const deskColor = tokensWxss.match(/^  --ll-desk: (.+);$/m)?.[1] || '#a8c8bb';
fs.writeFileSync(
  path.join(exampleDir, 'custom-tab-bar', 'index.wxss'),
  [
    '/* The library paints the tabs; the bar fixes position and paints the desk',
    '   cloth the docs pages sit on (inlined: page vars don\'t cross into',
    '   custom-tab-bar). Same stock as the landing pad\'s surface. */',
    '.tabbar {',
    `  --ll-desk: ${deskColor};`,
    `  --ll-tex-linen: ${tileVar('linen')};`,
    '  position: fixed;',
    '  bottom: 0;',
    '  left: 0;',
    '  right: 0;',
    '  background-color: var(--ll-desk, #a8c8bb);',
    '  background-image: var(--ll-tex-linen);',
    '  background-size: 160px 160px;',
    '  background-repeat: repeat;',
    '  /* inset the tabs so the trigger ink clears the screen corners */',
    '  padding: 0 56rpx env(safe-area-inset-bottom);',
    '}',
    '.tabbar .tab-text { font-size: 22rpx; }',
  ].join('\n'),
);
fs.writeFileSync(
  path.join(exampleDir, 'custom-tab-bar', 'index.json'),
  JSON.stringify(
    {
      usingComponents: {
        'll-tabs': compRef('tabs'),
        'll-tabs-list': compRef('tabs-list'),
        'll-tabs-trigger': compRef('tabs-trigger'),
        'll-icon': compRef('icon'),
      },
    },
    null,
    2,
  ) + '\n',
);

// app.json — index + about tab are the main-package pages; demos live in subpackages.
const appJsonPath = path.join(exampleDir, 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
appJson.pages = ['pages/index/index', 'pages/about/index'];
appJson.tabBar = {
  custom: true,
  color: '#8a857c',
  selectedColor: '#2a2420',
  backgroundColor: '#f8f5ee',
  borderStyle: 'black',
  list: [
    { pagePath: 'pages/index/index', text: 'Components' },
    { pagePath: 'pages/about/index', text: 'About' },
  ],
};
appJson.subPackages = CLUSTERS.map(([root]) => ({
  root,
  pages: pagesByRoot.get(root).map((name) => `pages/${name}/index`),
})).filter((pkg) => pkg.pages.length > 0);
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');

// Package-size report: WeChat rejects any package over 2MB on upload.
const dirBytes = (dir) => {
  let total = 0;
  const walk = (p) => {
    if (!fs.existsSync(p)) return;
    for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
      const fp = path.join(p, entry.name);
      if (entry.isDirectory()) walk(fp);
      else total += fs.statSync(fp).size;
    }
  };
  walk(dir);
  return total;
};
const mainBytes =
  dirBytes(path.join(exampleDir, 'common')) +
  dirBytes(path.join(exampleDir, 'components')) +
  dirBytes(examplePages) +
  dirBytes(path.join(exampleDir, 'assets'));
const rows = [['main (index+common+shared+assets)', mainBytes]];
for (const [root] of CLUSTERS) rows.push([root, dirBytes(path.join(exampleDir, root))]);
let failed = false;
for (const [label, bytes] of rows) {
  const over = bytes > 2 * 1024 * 1024;
  failed ||= over;
  console.log(`  ${over ? '✗' : '✓'} ${label.padEnd(36)} ${(bytes / 1024).toFixed(0)}KB${over ? ' > 2MB!' : ''}`);
}
if (failed) throw new Error('A package exceeds the 2MB upload limit — rebalance CLUSTERS');
console.log(`✓ regenerated packages/example (${Object.keys(pageRootOf).length + 1} pages, ${CLUSTERS.length} subpackages)`);
