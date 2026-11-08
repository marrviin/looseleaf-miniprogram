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
import {
  RECIPES,
  bucketBox,
  runRecipe,
  hasFace,
  splitFaces,
  translatePath,
  stockOf,
  TOOTH_TILES,
  STICKY_VEIL,
  tileOffsets,
  farShadow,
} from './ink-engine';
import { onHandFontReady } from './hand-font';
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

/** Resolve paint keys to hex — an isolated SVG can't see the page's CSS vars.
 *  Exported for ll-icon, which draws skeletons outside the recipe pipeline.
 *  `ink` bakes a replacement for currentColor (upstream icons follow the
 *  parent text color; a background-image data URI can't inherit it). */
export function resolvePaint(svg, ink) {
  return svg
    .replace(/var\(--ll-([a-z0-9-]+)\)/g, (_, key) => TOKENS[`--ll-${key}`] ?? '#2a2420')
    .replace(/var\(--font-hand[^)]*\)/g, 'cursive')
    .replace(/currentColor/g, ink || TOKENS['--ll-ink'] || '#2a2420');
}

function svgDataUri(part, { w, h, pad }) {
  // Padded viewBox + an ink layer inset by -pad px maps art 1:1 onto the
  // element at every size, and keeps the hand-drawn stroke overhang visible.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${w + pad * 2} ${h + pad * 2}">${resolvePaint(part)}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
export { svgDataUri };

// --- sheet faces ------------------------------------------------------------
// Sheet-kind recipes (label-tag, ...) leave <!--ll-face:...--> marks in their
// parts. Upstream renders those as CSS (looseleaf.css .ll-face + faceLook
// vars), NOT SVG: the face is a span clipped to the sheet path, filled with
// the stock color, the tooth texture tiles and a paper-light gradient, and
// (when the spec carries a cast) a far-shadow box-shadow span behind it. The
// stroke markup before the mark draws under the face, the markup after it
// (outline, eyelet patch, twine in front) draws over. We mirror that with
// views inside the padded ink layer.

/* --ll-paper-light (looseleaf.css) with the tokens precomputed: rgb(var()/calc())
   space syntax isn't reliably supported in the miniprogram webview. */
const PAPER_LIGHT =
  'linear-gradient(135deg, rgba(255,255,255,0.38), rgba(255,255,255,0) 42%, rgba(58,44,30,0.035))';

function hexToRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/** CSS for one face spec, filling the padded ink layer (w+2pad × h+2pad). */
function faceCss(spec, frame) {
  const pad = frame.pad;
  const S = stockOf(spec.stock);
  const tiles = TOOTH_TILES[S.tooth];
  const sizes = tiles.map(([, w, h]) => [w, h]);
  // Upstream's veil is color-mix(stock, transparent) — unsupported in the
  // miniprogram webview, so precompute the rgba from the token hex.
  const veil = S.gum && spec.veil !== false ? STICKY_VEIL : 0;
  const baseHex = TOKENS[`--ll-${S.base}`] || '#f8f5ee';
  const veilLayer = `linear-gradient(${hexToRgba(baseHex, veil)},${hexToRgba(baseHex, veil)})`;
  const images = [veilLayer, tiles.map(([t]) => `var(--ll-tex-${t})`).join(','), PAPER_LIGHT].join(',');
  const size = ['100% 100%', sizes.map(([w, h]) => `${w}px ${h}px`).join(','), '100% 100%'].join(',');
  const position = ['0 0', tileOffsets(spec.seed, sizes), '0 0'].join(',');
  const d = translatePath(spec.d, pad, pad);
  // Upstream clips the face with clip-path:path() — ignored outright by the
  // simulator webview (Chromium <88; path() needs 88). An SVG mask via
  // -webkit-mask-image clips the same way and works everywhere we run.
  const mask =
    `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg'` +
    ` viewBox='0 0 ${frame.w + pad * 2} ${frame.h + pad * 2}'%3E` +
    `%3Cpath d='${d}'${spec.evenodd ? ` fill-rule='evenodd'` : ''} fill='%23fff'/%3E%3C/svg%3E")`;
  return (
    `left:0;top:0;width:100%;height:100%;` +
    `background-color:var(--ll-${S.base});` +
    `background-image:${images};background-size:${size};background-position:${position};` +
    `-webkit-mask-image:${mask};-webkit-mask-size:100% 100%;`
  );
}

/** CSS for one far-shadow cast spec, positioned like upstream's .ll-face-shadow. */
function castCss(spec, { w, h, pad }) {
  const [t, r, b, l] = spec.cast.inset;
  // farShadow emits rgb(var(--ll-shade) / calc(a * var(--ll-shadow-k))) —
  // modern syntax the miniprogram webview may not parse; flatten to rgba.
  const shadow = farShadow(spec.cast.kind, !!spec.cast.radius).replace(
    /rgb\(var\(--ll-shade\) \/ calc\(([\d.]+) \* var\(--ll-shadow-k\)\)\)/g,
    (_, a) => `rgba(58,44,30,${a})`,
  );
  let css =
    `left:${l + pad}px;top:${t + pad}px;width:${w - l - r}px;height:${h - t - b}px;` +
    `box-shadow:${shadow};`;
  if (spec.cast.radius) css += `border-radius:${spec.cast.radius.map((v) => `${v}px`).join(' ')};`;
  return css;
}

/** Sheet recipes (paper-ink's drawSheet) put `<defs>` (the outline path the
    contact shadow and rim strokes `<use>`) on one side of the face mark —
    splitting at the mark would break those references in the isolated
    fragment SVGs. Hoist every defs block into each fragment instead. */
function hoistDefs(part) {
  const defs = [];
  const s = part.replace(/<defs>[\s\S]*?<\/defs>/g, (m) => {
    defs.push(m);
    return '';
  });
  return { s, defs: defs.join('') };
}

/** Split one layer part into under-strokes / faces+casts / over-strokes.
    Returns null when the part carries no face mark (plain SVG path). */
function splitLayer(part, frame) {
  if (!hasFace(part)) return null;
  const hoisted = hoistDefs(part);
  const out = { before: '', after: '', faces: [], casts: [] };
  let seenFace = false;
  for (const piece of splitFaces(hoisted.s)) {
    if (typeof piece === 'string') {
      if (seenFace) out.after += piece;
      else out.before += piece;
      continue;
    }
    seenFace = true;
    if (piece.paper === false) {
      if (piece.cast) out.casts.push(castCss(piece, frame));
    } else {
      if (piece.cast) out.casts.push(castCss(piece, frame));
      out.faces.push(faceCss(piece, frame));
    }
  }
  if (out.before) out.before = hoisted.defs + out.before;
  if (out.after) out.after = hoisted.defs + out.after;
  return out;
}


/** Upstream hides ink groups with a CSS rule keyed on data-hide-on
    (looseleaf.css "svg[data-ink] [data-hide-on~=…]"). The miniprogram ink
    layer is a stacked background-image, so there is no CSS to do it —
    strip the matching groups out of the SVG part text instead (balanced
    <g> scan; recipes emit well-formed nesting). */
function stripHideOn(part, token) {
  if (!part || part.indexOf('data-hide-on') === -1) return part;
  let out = '';
  let depth = 0;
  let hideDepth = -1;
  let last = 0;
  let m;
  const re = /<(\/?)g\b[^>]*?(\/?)>/g;
  while ((m = re.exec(part))) {
    if (m[1] === '/') {
      // closing tag
      depth--;
      if (hideDepth !== -1) {
        // inside a hidden group: drop text + the tag; its own close ends the span
        if (depth === hideDepth) hideDepth = -1;
      } else {
        out += part.slice(last, m.index) + m[0];
      }
    } else if (m[2] === '/') {
      // self-closing group
      if (hideDepth === -1) {
        const hide = /data-hide-on="([^"]*)"/.exec(m[0]);
        if (hide && hide[1].split(/\s+/).includes(token)) {
          out += part.slice(last, m.index);
        } else {
          out += part.slice(last, m.index) + m[0];
        }
      }
    } else {
      if (hideDepth === -1) {
        const hide = /data-hide-on="([^"]*)"/.exec(m[0]);
        if (hide && hide[1].split(/\s+/).includes(token)) {
          out += part.slice(last, m.index);
          hideDepth = depth; // the close that brings depth back here ends the hidden span
        } else {
          out += part.slice(last, m.index) + m[0];
        }
      }
      depth++;
    }
    last = re.lastIndex;
  }
  out += part.slice(last);
  return out;
}

/** Variant of stripHideOn for recipes that emit named parts (`ink.part('seam', …)`
    → <g data-part="seam">). Upstream hides parts with plain CSS (e.g. the first
    toggle-group item hides its seam: [data-part=seam]:hidden); a background-image
    ink layer has no CSS, so named groups are cut out of the SVG text instead. */
function stripDataPart(part, names) {
  if (!part || !names || !names.length || part.indexOf('data-part') === -1) return part;
  let out = '';
  let depth = 0;
  let hideDepth = -1;
  let last = 0;
  let m;
  const re = /<(\/?)g\b[^>]*?(\/?)>/g;
  while ((m = re.exec(part))) {
    if (m[1] === '/') {
      depth--;
      if (hideDepth !== -1) {
        if (depth === hideDepth) hideDepth = -1;
      } else {
        out += part.slice(last, m.index) + m[0];
      }
    } else if (m[2] === '/') {
      if (hideDepth === -1) {
        const hit = /data-part="([^"]*)"/.exec(m[0]);
        if (hit && names.includes(hit[1])) {
          out += part.slice(last, m.index);
        } else {
          out += part.slice(last, m.index) + m[0];
        }
      }
    } else {
      if (hideDepth === -1) {
        const hit = /data-part="([^"]*)"/.exec(m[0]);
        if (hit && names.includes(hit[1])) {
          out += part.slice(last, m.index);
          hideDepth = depth;
        } else {
          out += part.slice(last, m.index) + m[0];
        }
      }
      depth++;
    }
    last = re.lastIndex;
  }
  out += part.slice(last);
  return out;
}

/** Render (or fetch from cache) the rest+pressed+focus layers for one ink spec.
 *  Exported for ll-switch, which draws the sliding thumb with the separate
 *  switch-thumb recipe inside the same component (upstream nests a
 *  SwitchThumb part with its own recipe in the same DOM).
 *  `opts.stripParts`: names of `<g data-part>` groups to cut from every layer
 *  (toggle-group's first item hides its seam — see stripDataPart). */
export function renderLayers(recipeId, box, params, seed, opts) {
  const recipe = RECIPES[recipeId];
  if (!recipe) return null;
  const strip = opts && opts.stripParts;
  const key = [recipeId, `${box.w}x${box.h}`, JSON.stringify(params), seed, strip ? strip.join(',') : ''].join('|');
  let entry = cache.get(key);
  if (!entry) {
    if (cache.size >= CACHE_MAX) cache.clear();
    const frame = runRecipe(recipe, {
      ...RUN_REQ,
      box,
      params,
      seed,
      lazy: ['pressed', 'focus', 'hover', 'checked', 'indeterminate'],
    });
    entry = { pad: frame.pad, w: box.w, h: box.h, uris: {}, faces: {}, casts: [] };
    // checked/indeterminate: on-state layers (checkbox etc.) — recipes that
    // don't define them just leave parts undefined. invalid: field-frame
    // recipes draw it instead of rest (see __applyInkLayer's fallback).
    for (const layer of ['rest', 'pressed', 'focus', 'hover', 'checked', 'indeterminate', 'invalid', 'open']) {
      const rawPart = frame.parts[layer];
      if (!rawPart) continue;
      const part = strip ? stripDataPart(rawPart, strip) : rawPart;
      const split = splitLayer(part, frame);
      if (!split) {
        entry.uris[layer] = svgDataUri(part, frame);
        // Recipes mark groups hideOn:'checked'/'open' (upstream hides them via
        // CSS when the host is checked/open); the stacked layer needs the
        // stripped rest to draw under the on-state layer. Same for
        // indeterminate.
        if (layer === 'rest') {
          for (const token of ['checked', 'indeterminate', 'open']) {
            const stripped = stripHideOn(part, token);
            if (stripped !== part) entry.uris[`rest-${token}`] = svgDataUri(stripped, frame);
          }
        }
      } else {
        entry.uris[layer] = {
          before: split.before ? svgDataUri(split.before, frame) : '',
          after: split.after ? svgDataUri(split.after, frame) : '',
        };
        if (split.faces.length) entry.faces[layer] = split.faces;
        if (layer === 'rest') entry.casts = split.casts;
      }
    }
    entry.faced = Object.keys(entry.faces).length > 0 || entry.casts.length > 0;
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
      // Open state (navigation-menu trigger/tab): stacks the recipe's `open`
      // layer over rest (the rest pencil sketch hides for it, hideOn open).
      open: false,
      // Faced (sheet) recipes: cast shadows, under/over stroke layers and the
      // CSS face views between them — see __applyFaced.
      inkFaced: false,
      inkUnderStyle: '',
      inkOverStyle: '',
      inkFaces: [],
      inkCasts: [],
    },
    lifetimes: {
      attached() {
        this.__inkPressed = false;
        // Slot content (page-owned) re-fires attached each time the owner's
        // wx:if renders it — reset the give-up counter so it measures again.
        this.__inkRetries = 0;
        this.__measureInk();
        // The first measurement races the hand font: until Kevin Sans lands,
        // labels lay out with the fallback font, so text-bearing boxes are
        // measured at the wrong width and the ink draws inset. Re-measure
        // once the font settles (no-op when it was already cached).
        onHandFontReady(() => {
          if (this.__inkDetached) return;
          setTimeout(() => this.__measureInk(), 50);
        });
      },
      detached() {
        this.__inkDetached = true;
      },
    },
    observers: {
      'seed, variant, size, shape, disabled, focusVisible, hovered, pressed, open'() {
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
        // Root selector: .ll-<recipe> (the guide's naming rule), overridable
        // via data.llInkSelector when a component's root class differs.
        const recipeId = this.data.llInkRecipe;
        if (!recipeId) return;
        const selector = this.data.llInkSelector || `.ll-${recipeId}`;
        this.createSelectorQuery()
          .select(selector)
          .boundingClientRect((rect) => {
            if (!rect || !rect.width || !rect.height) {
              // Not laid out yet — retry until it is. Detached slot content
              // (a closed sheet's buttons) reports null forever, and freshly
              // mounted content inside a fixed sheet can report 0x0 for a few
              // seconds while the simulator settles. Retry fast for the first
              // second, then slower, then at 1s out to ~4 minutes so a
              // component that becomes visible late still gets its ink.
              if (this.__inkRetries === undefined) this.__inkRetries = 0;
              const n = ++this.__inkRetries;
              if (n < 300) setTimeout(() => this.__measureInk(), n <= 20 ? 50 : n <= 60 ? 250 : 1000);
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
          // Component-specific extras (badge tone/tally, ...): the component
          // defines __inkParams (object or fn) in its attached/observers.
          ...(typeof this.__inkParams === 'function' ? this.__inkParams() : this.__inkParams),
        };
        this.__inkSeed = seed;
        this.__inkEntry = renderLayers(recipeId, bucketBox(this.__inkBox.w, this.__inkBox.h), params, seed, this.__inkStrip ? { stripParts: this.__inkStrip } : undefined);
        this.__applyInkLayer();
      },
      /** Compose the ink layer: layers stack like upstream's one-SVG model.
          Upstream order rest < hover < pressed < focus (later renders on top),
          hover hides while pressed; hover adds the -0.9deg drawing tilt.
          Faced recipes (sheet components) render a sandwich instead:
          cast shadow → under-strokes → face views → over-strokes, mirroring
          upstream's SheetLayers DOM. */
      __applyInkLayer() {
        const entry = this.__inkEntry;
        if (!entry) return;
        const d = this.data;
        // Disabled: recipes with a real disabled layer swap it in for all
        // others; recipes that draw disabled inside rest (checkbox) fall
        // through to the normal stack — the probe caches null, so the
        // swap-in is attempted only once.
        if (d.disabled && entry.uris.disabled !== null) {
          if (entry.uris.disabled === undefined) this.__applyDisabled(entry);
          if (entry.uris.disabled) return;
        }
        const pressed = this.__inkPressed || d.pressed;
        const hovered = d.hovered && !pressed;
        const stack = [];
        // background-image: first listed renders on top.
        if (d.focusVisible && entry.uris.focus) stack.push(entry.uris.focus);
        if (pressed && entry.uris.pressed) stack.push(entry.uris.pressed);
        if (hovered && entry.uris.hover) stack.push(entry.uris.hover);
        // On-state layers stack over rest like upstream's one-SVG model
        // (checked shows its fill + reveal mark over the box; rest stays).
        // open comes before checked (a tab is one or the other).
        if (d.open && entry.uris.open) stack.push(entry.uris.open);
        if (d.indeterminate && entry.uris.indeterminate) stack.push(entry.uris.indeterminate);
        else if (d.checked && entry.uris.checked) stack.push(entry.uris.checked);
        // Field-frame recipes (input, textarea) draw invalid INSTEAD of rest
        // — the red frame replaces the pencil box, never stacks over it.
        const restUri =
          d.open && entry.uris['rest-open']
            ? entry.uris['rest-open']
            : d.indeterminate && entry.uris['rest-indeterminate']
              ? entry.uris['rest-indeterminate']
              : d.checked && entry.uris['rest-checked']
                ? entry.uris['rest-checked']
                : (entry.uris.rest ?? entry.uris.invalid);
        stack.push(restUri);
        if (!stack.length) return;
        if (entry.faced) {
          this.__applyFaced(entry, stack, { focusVisible: d.focusVisible, pressed, hovered });
          return;
        }
        const tilt = hovered ? 'transform:rotate(var(--ll-hover-tilt, -0.9deg));' : '';
        this.setData({ inkStyle: `inset:${-entry.pad}px;${tilt}background-image:${stack.map((u) => `url("${u}")`).join(',')}` });
      },
      /** Faced variant: pick the one active face set (upstream shows only the
          state's face span; rest is the default), stack under/over strokes. */
      __applyFaced(entry, stack, states) {
        const d = this.data;
        // Faces stack like the layer stack (upstream keeps every layer's face
        // in the DOM and shows the active ones over rest): rest first, then
        // the active interaction state's face, then on-state faces.
        const faces = [...(entry.faces.rest || [])];
        if (states.focusVisible && entry.faces.focus) faces.push(...entry.faces.focus);
        else if (states.pressed && entry.faces.pressed) faces.push(...entry.faces.pressed);
        else if (states.hovered && entry.faces.hover) faces.push(...entry.faces.hover);
        if (d.open && entry.faces.open) faces.push(...entry.faces.open);
        if (d.indeterminate && entry.faces.indeterminate) faces.push(...entry.faces.indeterminate);
        else if (d.checked && entry.faces.checked) faces.push(...entry.faces.checked);
        // The engine emits faces as left/top 0 + 100%×100% of their parent,
        // expecting the parent to be the PADDED box (upstream SheetLayers
        // positions faces at inset:-pad). Our sandwich parents are the
        // unpadded root, so stretch each face over the padded box instead —
        // its clip-path coordinates live in that space.
        const faceStyle = (f) =>
          typeof f === 'string' ? f.replace(/^left:0;top:0;width:100%;height:100%/, `inset:${-entry.pad}px`) : f;
        const layerStyle = (side) =>
          stack
            .map((u) => (typeof u === 'string' ? (side === 'before' ? u : '') : u[side]))
            .filter(Boolean)
            .map((u) => `url("${u}")`)
            .join(',');
        this.setData({
          inkStyle: '',
          inkFaced: true,
          inkUnderStyle: `inset:${-entry.pad}px;background-image:${layerStyle('before')}`,
          inkOverStyle: `inset:${-entry.pad}px;background-image:${layerStyle('after')}`,
          inkFaces: faces.map(faceStyle),
          inkCasts: entry.casts,
        });
      },
      /** Disabled art is drawn by the recipe only when params.disabled — render
          it on first use (replaces every other layer) and stash it on the entry. */
      __applyDisabled(entry) {
        if (!entry.uris.disabled) {
          const d = this.data;
          const recipeId = d.llInkRecipe;
          if (!RECIPES[recipeId]) return;
          const params = {
            variant: d.variant ?? 'default',
            size: d.size ?? 'default',
            shape: d.shape && d.shape !== 'default' ? d.shape : undefined,
            disabled: true,
            // Component-specific extras (tabs variant/orientation, ...), so a
            // disabled layer draws with the same recipe params as rest.
            ...(typeof this.__inkParams === 'function' ? this.__inkParams() : this.__inkParams),
            disabled: true,
          };
          const frame = runRecipe(RECIPES[recipeId], {
            ...RUN_REQ,
            box: { w: entry.w, h: entry.h },
            params,
            seed: this.__inkSeed,
            lazy: [],
          });
          const part = frame.parts.disabled;
          if (!part) {
            entry.uris.disabled = null;
          } else {
            const split = splitLayer(part, frame);
            entry.uris.disabled = split
              ? {
                  before: split.before ? svgDataUri(split.before, frame) : '',
                  after: split.after ? svgDataUri(split.after, frame) : '',
                }
              : svgDataUri(part, frame);
            entry.disabledFaces = split ? split.faces : [];
            entry.disabledCasts = split ? split.casts : [];
          }
        }
        const uri = entry.uris.disabled;
        if (!uri) return;
        if (typeof uri === 'string') {
          this.setData({ inkFaced: false, inkStyle: `inset:${-entry.pad}px;background-image:url("${uri}")` });
        } else {
          this.setData({
            inkStyle: '',
            inkFaced: true,
            inkUnderStyle: `inset:${-entry.pad}px;${uri.before ? `background-image:url("${uri.before}")` : ''}`,
            inkOverStyle: `inset:${-entry.pad}px;${uri.after ? `background-image:url("${uri.after}")` : ''}`,
            inkFaces: (entry.disabledFaces || []).map((f) =>
              typeof f === 'string' ? f.replace(/^left:0;top:0;width:100%;height:100%/, `inset:${-entry.pad}px`) : f,
            ),
            inkCasts: entry.disabledCasts || [],
          });
        }
      },
    },
  });
}
