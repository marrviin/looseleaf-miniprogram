/**
 * Ink runtime — draws each component's hand-drawn artwork at its real size.
 *
 * The upstream looseleaf ink engine (pure TS) is bundled into
 * common/ink-engine.js; this behavior runs the component's recipe with the
 * element's measured box (bucketed to 4x2px like upstream), resolves paint
 * vars to static hex (common/tokens.js) and injects the layer as an SVG
 * data-URI background on the .ll-ink-layer view.
 *
 * Rendering at the true size keeps stroke widths 1:1 CSS px and corners
 * round at any button width — stretching one baked raster (the earlier PNG
 * pipeline) thinned strokes and squared the corners, which is why this
 * runtime approach replaced it.
 *
 * A component opts in by setting `data: { llInkRecipe: '<recipe>' }` and
 * rendering `<view class="ll-ink-layer" style="{{inkStyle}}" />` inside its
 * root, with slot content wrapped in a positioned, z-index-raised view so
 * ink stays behind the label, as upstream.
 */
import { RECIPES, bucketBox, runRecipe } from './ink-engine';
import TOKENS from './tokens';

const KNOBS = { wobble: 1, misreg: 1, bleed: 1, width: 1 };
const RUN_REQ = { tier: 'lo', density: 'comfortable', knobs: KNOBS, dir: 'ltr' };

/** Cache of rendered layers, keyed by recipe|box|params|seed (like upstream's cache.ts). */
const cache = new Map();
const CACHE_MAX = 200;

export const SEED_POOL_SIZE = 5; // unused at runtime; kept for API compat

/** Deterministic seed from a string, so the same props always get the same wobble. */
export function hashSeed(input) {
  let h = 5381;
  const s = String(input ?? '');
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Resolve paint keys to hex — an isolated SVG can't see the page's CSS vars. */
function resolvePaint(svg) {
  return svg
    .replace(/var\(--ll-([a-z0-9-]+)\)/g, (_, key) => TOKENS[`--ll-${key}`] ?? '#2a2420')
    .replace(/var\(--font-hand[^)]*\)/g, 'cursive');
}

function svgDataUri(part, { w, h, pad }) {
  // Padded viewBox + an ink layer inset by -pad px maps art 1:1 onto the
  // element at every size, and keeps the hand-drawn stroke overhang visible.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${w + pad * 2} ${h + pad * 2}">${resolvePaint(part)}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Render (or fetch from cache) the rest+pressed+focus layers for one ink spec. */
function renderLayers(recipeId, box, params, seed) {
  const recipe = RECIPES[recipeId];
  if (!recipe) return null;
  const key = [recipeId, `${box.w}x${box.h}`, JSON.stringify(params), seed].join('|');
  let entry = cache.get(key);
  if (!entry) {
    if (cache.size >= CACHE_MAX) cache.clear();
    const frame = runRecipe(recipe, { ...RUN_REQ, box, params, seed, lazy: ['pressed', 'focus', 'hover'] });
    entry = { pad: frame.pad, w: box.w, h: box.h, uris: {} };
    for (const layer of ['rest', 'pressed', 'focus', 'hover']) {
      if (frame.parts[layer]) entry.uris[layer] = svgDataUri(frame.parts[layer], frame);
    }
    cache.set(key, entry);
  }
  return entry;
}

export function attachInk() {
  return Behavior({
    properties: {
      seed: {
        type: null,
        optionalTypes: [String, Number],
        value: '',
      },
      // WeChat buttons get no focus events; this is the controlled equivalent
      // of upstream's [data-focus-visible] — forces the hand-drawn focus ring.
      focusVisible: {
        type: Boolean,
        value: false,
      },
      // Controlled states mirroring upstream's [data-hover] / [data-pressed]
      // forced attributes (hover/pressed layers are pointer-driven upstream;
      // WeChat has no mouse hover, so these are props).
      hovered: {
        type: Boolean,
        value: false,
      },
      pressed: {
        type: Boolean,
        value: false,
      },
    },
    data: {
      inkStyle: '',
      inkPressed: false,
    },
    lifetimes: {
      attached() {
        this.__inkPressed = false;
        this.__measureInk();
      },
    },
    observers: {
      'seed, variant, size, shape, disabled, focusVisible, hovered, pressed'() {
        // Size changes the box; the others change the params/layer.
        this.__measureInk();
      },
    },
    methods: {
      /** Bind from wxml: touchstart → pressed layer stacks over rest. */
      __inkTouchStart() {
        this.__inkPressed = true;
        this.setData({ inkPressed: true });
        this.__applyInkLayer();
      },
      /** Bind from wxml: touchend/touchcancel → back to rest layer. */
      __inkTouchEnd() {
        this.__inkPressed = false;
        this.setData({ inkPressed: false });
        this.__applyInkLayer();
      },
      /** Measure the root element, then draw ink at its bucketed box. */
      __measureInk() {
        // The ink spec (recipe/variant/…) may arrive before layout; remember
        // the latest props and (re)draw once a real box is measured.
        this.createSelectorQuery()
          .select('.ll-button')
          .boundingClientRect((rect) => {
            if (!rect || !rect.width || !rect.height) {
              // Not laid out yet (e.g. wx:if branch just mounted) — retry next frame.
              if (this.__inkRetries === undefined) this.__inkRetries = 0;
              if (this.__inkRetries++ < 20) setTimeout(() => this.__measureInk(), 50);
              return;
            }
            this.__inkRetries = 0;
            this.__inkBox = { w: rect.width, h: rect.height };
            this.__renderInk();
          })
          .exec();
      },
      __renderInk() {
        const recipeId = this.data.llInkRecipe;
        if (!recipeId || !this.__inkBox) return;
        const d = this.data;
        const seedKey = `${recipeId}:${d.variant ?? 'default'}:${d.size ?? 'default'}:${d.shape ?? 'default'}:${d.seed ?? ''}`;
        const seed = `${hashSeed(seedKey)}`;
        const params = {
          variant: d.variant ?? 'default',
          size: d.size ?? 'default',
          shape: d.shape && d.shape !== 'default' ? d.shape : undefined,
          disabled: false,
        };
        this.__inkSeed = seed;
        this.__inkEntry = renderLayers(recipeId, bucketBox(this.__inkBox.w, this.__inkBox.h), params, seed);
        this.__applyInkLayer();
      },
      /** Compose the ink layer: layers stack like upstream's one-SVG model.
          Upstream order rest < hover < pressed < focus (later renders on top),
          hover hides while pressed; hover adds the -0.9deg drawing tilt. */
      __applyInkLayer() {
        const entry = this.__inkEntry;
        if (!entry) return;
        const d = this.data;
        if (d.disabled) {
          const uri = this.__disabledUri(entry);
          if (uri) this.setData({ inkStyle: `inset:${-entry.pad}px;background-image:url("${uri}")` });
          return;
        }
        const pressed = this.__inkPressed || d.pressed;
        const hovered = d.hovered && !pressed;
        const stack = [];
        // background-image: first listed renders on top.
        if (d.focusVisible && entry.uris.focus) stack.push(entry.uris.focus);
        if (pressed && entry.uris.pressed) stack.push(entry.uris.pressed);
        if (hovered && entry.uris.hover) stack.push(entry.uris.hover);
        stack.push(entry.uris.rest);
        if (!stack.length) return;
        const tilt = hovered ? 'transform:rotate(var(--ll-hover-tilt, -0.9deg));' : '';
        this.setData({ inkStyle: `inset:${-entry.pad}px;${tilt}background-image:${stack.map((u) => `url("${u}")`).join(',')}` });
      },
      /** Disabled art is drawn by the recipe only when params.disabled — render
          it on first use (replaces every other layer) and stash it on the entry. */
      __disabledUri(entry) {
        if (entry.uris.disabled) return entry.uris.disabled;
        const d = this.data;
        const recipeId = d.llInkRecipe;
        if (!RECIPES[recipeId]) return null;
        const params = {
          variant: d.variant ?? 'default',
          size: d.size ?? 'default',
          shape: d.shape && d.shape !== 'default' ? d.shape : undefined,
          disabled: true,
        };
        const frame = runRecipe(RECIPES[recipeId], {
          ...RUN_REQ,
          box: { w: entry.w, h: entry.h },
          params,
          seed: this.__inkSeed,
          lazy: [],
        });
        entry.uris.disabled = frame.parts.disabled ? svgDataUri(frame.parts.disabled, frame) : null;
        return entry.uris.disabled;
      },
    },
  });
}
