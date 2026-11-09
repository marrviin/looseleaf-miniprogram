/**
 * Mount helper — attach an ll-* component in miniprogram-simulate.
 *
 * Handles the three usingComponents reference styles the library uses:
 *   '../icon/icon'                                  (relative)
 *   '/common/icon/icon'                             (root-absolute)
 *   'looseleaf-miniprogram/components/icon/icon'    (bare package self-ref)
 *
 * Dependencies are resolved and loaded ONCE per test file (per jsdom window)
 * via simulate's cross-load registry (see patchedDependencies in the root
 * package.json), then passed to simulate.load as id overrides so no component
 * path is ever registered twice — jest does not re-execute already-required
 * component modules, which is what makes naive double registration break.
 */
const fs = require('fs');
const path = require('path');
const simulate = require('miniprogram-simulate');

const SRC = path.resolve(__dirname, '../../../src');
const PKG_NAME = 'looseleaf-miniprogram';

/** resolvedPath (no ext) -> simulate id, one registry per test file. */
const registry = new Map();

/** Resolve a usingComponents value to an absolute source path (no ext). */
function resolveRef(fromDir, value) {
  if (value.startsWith('.')) return path.resolve(fromDir, value);
  if (value.startsWith('/')) return path.join(SRC, value);
  if (value.startsWith(`${PKG_NAME}/`)) return path.join(SRC, value.slice(PKG_NAME.length + 1));
  return null; // third-party npm package — not resolvable in simulate
}

/** Load a component definition (and its dependency subtree) once. */
function loadAt(absPath) {
  const key = path.resolve(absPath);
  if (registry.has(key)) return registry.get(key);

  const json = JSON.parse(fs.readFileSync(`${key}.json`, 'utf8'));
  const overrides = {};
  for (const [tag, ref] of Object.entries(json.usingComponents || {})) {
    const dep = resolveRef(path.dirname(key), ref);
    if (dep) overrides[tag] = loadAt(dep);
  }

  const id = simulate.load(key, undefined, {
    rootPath: SRC,
    // 'official' (wcc) compiles every wxml under rootPath in one native call —
    // 368 components overflow its 1MB spawn buffer. The pure-JS parser only
    // compiles the requested component and is fast enough for CI.
    compiler: 'simulate',
    // Pass resolved dep ids so register() never re-registers a known path.
    usingComponents: overrides,
  });
  registry.set(key, id);
  return id;
}

/** Convenience: load `components/<dir>/<name>`. */
function loadDefinition(dir, name) {
  return loadAt(path.join(SRC, 'components', dir, name));
}

/**
 * Mount `components/<dir>/<name>` with `props`. Returns a simulate
 * RootComponent: `comp.querySelector('.ll-x')`, `comp.dom`, `comp.instance`
 * (the real component instance: data, methods) etc.
 */
function mount(rel, props = {}) {
  const [dir, name] = rel.split('/');
  const id = loadDefinition(dir, name);
  const comp = simulate.render(id, props);
  comp.attach(document.createElement('parent-wrapper'));
  return comp;
}

module.exports = { mount, loadDefinition, loadAt, SRC };
