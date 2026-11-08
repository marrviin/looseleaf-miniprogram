/**
 * Parse the upstream looseleaf.css and fully resolve every custom property to
 * a static CSS value (color-mix() / var() / rgb() pre-evaluated), since WXSS
 * cannot rely on color-mix() and baked SVGs cannot resolve var() at all.
 *
 * Used by script/bake-tokens.mjs (emits tokens.wxss) and script/bake-ink.mjs
 * (resolves paint keys to hex inside baked SVG markup).
 */
import fs from 'node:fs';
import { parse, converter } from 'culori';

const UPSTREAM_CSS = '/Users/panmenglin/github/looseleaf/src/styles/looseleaf.css';

/** Extract `--name: value` declarations from every `:root { … }` block. */
export function parseRootVars(css = fs.readFileSync(UPSTREAM_CSS, 'utf8')) {
  const vars = new Map();
  for (const block of css.matchAll(/:root\s*\{([^}]*)\}/g)) {
    for (const decl of block[1].matchAll(/(--[a-zA-Z0-9-]+)\s*:\s*([^;]+);/g)) {
      vars.set(decl[1], decl[2].trim());
    }
  }
  return vars;
}

/**
 * Resolve var()/color-mix()/rgb() down to a static value.
 * `vars` maps --name -> raw value; recursion terminates because :root values
 * only reference other :root values (no cycles upstream).
 */
export function resolveValue(value, vars) {
  let out = value;
  // Substitute var(--x) and var(--x, fallback) until none remain (max 16 rounds).
  for (let i = 0; i < 16 && out.includes('var('); i++) {
    out = out.replace(/var\((--[a-zA-Z0-9-]+)(?:\s*,\s*([^()]*(?:\([^()]*\)[^()]*)*))?\)/g, (_, name, fallback) => {
      const v = vars.get(name);
      if (v !== undefined) return resolveValue(v, vars);
      if (fallback !== undefined) return fallback.trim();
      return '';
    });
  }
  // color-mix(in srgb, C1 P1%, C2) -> static mix
  for (let i = 0; i < 16 && out.includes('color-mix('); i++) {
    out = out.replace(/color-mix\(\s*in srgb\s*,\s*([^,]+?)\s*([0-9.]+%)?\s*,\s*([^,]+?)\s*([0-9.]+%)?\s*\)/gi, (_, c1, p1, c2, p2) => mixSrgb(c1.trim(), p1, c2.trim(), p2));
  }
  return out.trim();
}

/** sRGB mix with the color-mix() weight rules (percent on first color; 50/50 default). */
function mixSrgb(c1raw, p1, c2raw, p2) {
  const c1 = toSrgb(c1raw);
  const c2 = toSrgb(c2raw);
  if (!c1 || !c2) return c1raw;
  let w1 = p1 ? parseFloat(p1) / 100 : p2 ? 1 - parseFloat(p2) / 100 : 0.5;
  const w2 = 1 - w1;
  // Normalize weights per CSS spec when alpha < 1 (premultiplied mixing).
  const a1 = c1.alpha ?? 1;
  const a2 = c2.alpha ?? 1;
  const w1n = w1 * a1;
  const w2n = w2 * a2;
  const alpha = w1n + w2n;
  if (alpha === 0) return 'transparent';
  const ch = (x, y) => (x * w1n + y * w2n) / alpha;
  const r = Math.round(ch(c1.r, c2.r) * 255);
  const g = Math.round(ch(c1.g, c2.g) * 255);
  const b = Math.round(ch(c1.b, c2.b) * 255);
  const a = Math.round(((a1 * w1 + a2 * w2) + Number.EPSILON) * 1000) / 1000;
  return a < 1 ? `rgba(${r} ${g} ${b} / ${a})` : `rgb(${r} ${g} ${b})`;
}

function toSrgb(str) {
  const c = parse(str);
  return c ? converter('rgb')(c) : null;
}

/** Fully-resolved token map: --name -> static value. */
export function resolveTokens(css) {
  const raw = parseRootVars(css);
  const out = new Map();
  for (const [name, value] of raw) out.set(name, resolveValue(value, raw));
  return out;
}

const remaining = (v) => /var\(|color-mix\(/.test(v);

if (import.meta.url === `file://${process.argv[1]}`) {
  const tokens = resolveTokens();
  const bad = [...tokens.entries()].filter(([, v]) => remaining(v));
  console.log(`resolved ${tokens.size} tokens, ${bad.length} unresolved`);
  for (const [k, v] of bad.slice(0, 10)) console.log('  ', k, '=', v);
}
