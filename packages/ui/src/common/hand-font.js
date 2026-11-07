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
let readyPromise = null;

/** Kick off the one-time font registration; resolves when both faces settle
    (success OR failure — either way text metrics are final). */
export function ensureHandFont() {
  if (requested) return readyPromise;
  requested = true;
  if (typeof wx === 'undefined' || typeof wx.loadFontFace !== 'function') {
    readyPromise = Promise.resolve();
    return readyPromise;
  }
  readyPromise = Promise.all(
    FACES.map(
      ({ weight, data }) =>
        new Promise((resolve) => {
          wx.loadFontFace({
            global: true,
            family: 'Kevin Sans',
            source: `url("${data}")`,
            desc: { weight: String(weight) },
            complete: resolve,
          });
        })
    )
  ).then(() => {});
  return readyPromise;
}

/** Run cb once the hand-font metrics are final (immediately if the load
    already settled or never started). Ink components use this to re-measure:
    their first measurement happens against the fallback font. */
export function onHandFontReady(cb) {
  ensureHandFont();
  (readyPromise || Promise.resolve()).then(cb);
}
