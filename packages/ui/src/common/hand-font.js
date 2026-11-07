/**
 * Hand-font loader — registers upstream "Kevin Sans" (Regular/Bold, subset to
 * Latin, see script/build-font.mjs) once per app session via wx.loadFontFace.
 *
 * Data-URI sources keep the library self-contained (no CDN). `global: true`
 * lets isolated components pick the face up (base library ≥ 2.10.0); if the
 * load fails (unsupported base library, etc.) text falls back to the system
 * font — the components stay usable, just less hand-drawn.
 */
import FACES from './font.js';

let requested = false;

export function ensureHandFont() {
  if (requested) return;
  requested = true;
  if (typeof wx === 'undefined' || typeof wx.loadFontFace !== 'function') return;
  for (const { weight, data } of FACES) {
    wx.loadFontFace({
      global: true,
      family: 'Kevin Sans',
      source: `url("${data}")`,
      desc: { weight: String(weight) },
    });
  }
}
