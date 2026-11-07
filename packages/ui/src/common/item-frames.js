import { edgeTile } from './ink-engine';

// Upstream `itemCss()` (lib/ink/recipes/item-ink.ts) bakes three "hands"
// (frames) of pencil tiles into a stylesheet: edge-h / edge-v tiles for the
// outline mask and a rule tile for the blue rules. Here the chosen frame's
// tiles go inline (--ll-it-eh/-ev/-r, one URL each); the wxss composes the
// mask-image lists from them with var(). (A single var holding the whole
// comma list is NOT applied by the webview — the comma list must live in the
// stylesheet, like ll-skeleton's.) Tiles are constants — compute once.
export const ITEM_FRAMES = 3;

let TILES = null;

export function itemTiles() {
  if (!TILES) {
    TILES = Array.from({ length: ITEM_FRAMES }, (_, f) => ({
      eh: edgeTile(`item|edge-h|${f}`, false),
      ev: edgeTile(`item|edge-v|${f}`, true),
      ru: edgeTile(`item|rule|${f}`, false),
    }));
  }
  return TILES;
}

/** Inline custom properties for one frame: the outline edge tiles (h/v) and
    the rule tile. (edgeTile() values are already url("…") wrapped.) */
export function itemFrameVars(frame) {
  const t = itemTiles()[((frame % ITEM_FRAMES) + ITEM_FRAMES) % ITEM_FRAMES];
  return `--ll-it-eh:${t.eh};--ll-it-ev:${t.ev};--ll-it-r:${t.ru}`;
}
