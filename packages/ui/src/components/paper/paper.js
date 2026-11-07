import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { svgDataUri } from '../../common/ink';
import {
  stockOf,
  TOOTH_TILES,
  STICKY_VEIL,
  tileOffsets,
  sheetShadow,
  tiltFor,
  isCutEdge,
  edgeInset,
  tape,
  clip,
  pin,
  staple,
  binderClip,
} from '../../common/ink-engine';
import TOKENS from '../../common/tokens';
import { rulesStyle, stockRules } from './rules';
import { props } from './props';

ensureHandFont();

function hexToRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/** --ll-shade (#3a2c1e) — sheetShadow()/farShadow() emit rgb(var(--ll-shade) /
    calc(a * var(--ll-shadow-k))), modern syntax the webview may not parse. */
function flattenShadow(css) {
  return css.replace(
    /rgb\(var\(--ll-shade\) \/ calc\(([\d.]+) \* var\(--ll-shadow-k\)\)\)/g,
    (_, a) => `rgba(58,44,30,${a})`,
  );
}

/** --ll-paper-light with the tokens precomputed (see common/ink.js). */
const PAPER_LIGHT =
  'linear-gradient(135deg, rgba(255,255,255,0.38), rgba(255,255,255,0) 42%, rgba(58,44,30,0.035))';

const DROP_TAPE = 'drop-shadow(0 0.6px 0.8px rgba(58,44,30,0.18))';
const DROP_PROP =
  'drop-shadow(0 1px 0.8px rgba(58,44,30,0.3)) drop-shadow(0 3px 2.4px rgba(58,44,30,0.16))';

/** Upstream TAPE_PLACES (paper.tsx): tailwind classes → px, length 64 h 20. */
const TAPE_PLACES = {
  corner: [{ top: -8, left: -28, angle: -38 }],
  top: [{ top: -12, center: -32, angle: -2 }],
  both: [
    { top: -8, left: -28, angle: -38 },
    { top: -8, right: -28, angle: 36 },
  ],
};
const TAPE_LEN = 64;
const TAPE_H = 20;

/** Upstream FASTENER_PLACE + the Fastener draw sizes. */
const FASTENERS = {
  clip: { draw: clip, opts: () => ({ height: 62 }), place: { top: -20, right: 32 } },
  pin: { draw: pin, opts: () => ({ size: 24 }), place: { top: -8, center: -12 } },
  staple: { draw: staple, opts: () => ({ length: 20 }), place: { top: 8, left: 8 } },
  'binder-clip': { draw: binderClip, opts: () => ({ width: 52 }), place: { top: -40, center: -26 } },
};

/** Upstream Tape/Fastener rotate through CSS clamp(±2.5 × --ll-tilt-max)=±5deg
    (tape) — replicate so the -38deg corner placement lands like upstream's. */
const clamp = (v, m) => Math.max(-m, Math.min(m, v));

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    sheetStyle: '',
    rulesCss: '',
    tapeItems: [],
    fastenerItem: '',
  },
  lifetimes: {
    attached() {
      this.__update();
    },
  },
  observers: {
    'stock, edge, tilt, tape, tapeKind, fastener, fastenerTone, shadow, shadowCss, rules, seed'() {
      this.__update();
    },
  },
  methods: {
    /** Cut edges are pure CSS upstream (no sheet ink is drawn): the face is
        the stock color + tooth tiles + paper-light with a box-shadow, all
        rotated by the seeded tilt. Drawn edges (torn, deckle, ...) run the
        sheet recipe through the faced ink sandwich. */
    __update() {
      const d = this.data;
      const seedKey = String(d.seed ?? '');
      const S = stockOf(d.stock);
      const edge = d.edge || S.edge;
      const drawn = !isCutEdge(edge);

      // tilt: true = seeded from the stock; number = degrees; false = flat.
      // Upstream clamps every sheet rotation to ±--ll-tilt-max (2deg).
      let deg = 0;
      if (d.tilt !== false) {
        const max = typeof d.tilt === 'number' ? Math.abs(d.tilt) : S.tilt;
        const raw =
          typeof d.tilt === 'number' ? d.tilt : tiltFor(`tilt:${seedKey || 'll-paper'}`, S.tilt);
        deg = clamp(Math.round(raw * 100) / 100, 2);
      }
      const rotate = deg ? `transform:rotate(${deg}deg);` : '';

      // Printed rules: the stock's default unless overridden; inset off the
      // drawn edge so the lines don't cross the torn outline.
      const ruleKind = d.rules || stockRules(d.stock);
      let rulesCss = rulesStyle(ruleKind);
      if (rulesCss && drawn) {
        const inset = Math.ceil(edgeInset(edge)) + 1;
        rulesCss += `left:${inset}px;top:${inset}px;right:${inset}px;bottom:${inset}px;`;
      }

      if (!drawn) {
        // Cut face: stock color, tooth tiles, paper-light, sticky veil, shadow.
        const tiles = TOOTH_TILES[S.tooth];
        const sizes = tiles.map(([, w, h]) => [w, h]);
        const veil = S.gum ? STICKY_VEIL : 0;
        const baseHex = TOKENS[`--ll-${S.base}`] || '#f8f5ee';
        const images = [
          veil ? `linear-gradient(${hexToRgba(baseHex, veil)},${hexToRgba(baseHex, veil)})` : 'linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0))',
          tiles.map(([t]) => `var(--ll-tex-${t})`).join(','),
          PAPER_LIGHT,
        ].join(',');
        const size = ['100% 100%', sizes.map(([w, h]) => `${w}px ${h}px`).join(','), '100% 100%'].join(',');
        const position = ['0 0', tileOffsets(seedKey || S.name, sizes), '0 0'].join(',');
        let boxShadow = '';
        // shadowCss (raw per-side box-shadow from overlays like ll-sheet)
        // overrides the stock's vertical shadow, as upstream's
        // --ll-sheet-shadow var does.
        if (d.shadowCss) {
          boxShadow = `box-shadow:${d.shadowCss};`;
        } else if (d.shadow !== 'none') {
          const kind = d.shadow === 'stock' ? S.shadow : d.shadow;
          boxShadow = `box-shadow:${flattenShadow(sheetShadow(kind))};`;
        }
        this.__inkParams = null;
        this.setData({
          llInkRecipe: '',
          inkFaced: false,
          inkStyle: '',
          sheetStyle: `${rotate}border-radius:2rpx;background-color:${baseHex};background-image:${images};background-size:${size};background-position:${position};${boxShadow}`,
          rulesCss,
        });
        this.__renderProps(seedKey);
        return;
      }

      // Drawn edge: the sheet recipe draws outline + face + cast shadow
      // (shadowCss is ignored — upstream's ::before drops it for drawn edges).
      const shadowKind = d.shadow === 'stock' ? undefined : d.shadow;
      this.__inkParams = () => ({ stock: S.name, edge, shadow: shadowKind });
      this.setData({ llInkRecipe: 'sheet', llInkSelector: '.ll-paper', sheetStyle: rotate, rulesCss });
      this.__measureInk();
      this.__renderProps(seedKey);
    },

    /** Tape strips and the fastener are fixed-size static drawings (upstream
        PropSvg) — position the box, size it +2pad so the stroke overhang
        stays visible, background = the padded viewBox data URI. */
    __renderProps(seedKey) {
      const d = this.data;
      const seed = seedKey || 'll-paper';
      const tapeItems = [];
      const places = TAPE_PLACES[d.tape];
      if (places) {
        places.forEach((p, i) => {
          const res = tape(`${seed}:tape:${i}|tape`, { kind: d.tapeKind, length: TAPE_LEN, height: TAPE_H });
          const pad = res.pad;
          const deg = clamp(Math.round((p.angle ?? tiltFor(`${seed}|tape`, 4)) * 100) / 100, 5);
          tapeItems.push(this.__propStyle(res, p, pad, deg, DROP_TAPE));
        });
      }
      let fastenerItem = '';
      const F = FASTENERS[d.fastener];
      if (F) {
        const tone = d.fastenerTone && d.fastenerTone !== 'steel' ? d.fastenerTone : undefined;
        const res = F.draw(`${seed}|fastener`, F.opts(tone));
        const jitter = Math.round(tiltFor(`${seed}|at`, 1) * 6);
        fastenerItem = this.__propStyle(res, F.place, res.pad, 0, DROP_PROP, jitter);
      }
      this.setData({ tapeItems, fastenerItem });
    },

    /** One prop box: place (px, rpx-scaled), padded art, rotate, drop shadow. */
    __propStyle(res, place, pad, deg, filter, jitter = 0) {
      const at = (v) => `${v * 2}rpx`;
      let pos = '';
      if (place.left !== undefined) pos += `left:${at(place.left - pad)};`;
      if (place.right !== undefined) pos += `right:${at(place.right - pad)};`;
      if (place.top !== undefined) pos += `top:${at(place.top - pad)};`;
      if (place.center !== undefined) pos += `left:50%;margin-left:${at(place.center - pad)};`;
      return (
        pos +
        `width:${res.w + pad * 2}px;height:${res.h + pad * 2}px;` +
        (deg ? `transform:rotate(${deg}deg) translateX(${jitter}px);` : jitter ? `transform:translateX(${jitter}px);` : '') +
        `filter:${filter};` +
        `background-image:url("${svgDataUri(res.svg, res)}");` +
        'background-size:100% 100%;background-repeat:no-repeat;'
      );
    },
  },
});
