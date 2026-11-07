/**
 * Mark behavior — the runtime for text-mark components (ll-highlight,
 * ll-strike, ll-underline, ll-scribble, ll-circled): upstream draws these
 * once per measured text line (use-mark-ink.ts measures the host inline
 * element with getClientRects(), one rect per line).
 *
 * The miniprogram has no per-line rect API, so the component renders its
 * `text` as inline word spans (`.ll-mark__w`); this behavior measures every
 * word box + the host box with SelectorQuery, groups the words into visual
 * lines, merges each line into one rect (min left → max right), folds in the
 * line metrics (lineMetrics + GUESS_RATIOS — upstream's own fallback when
 * canvas measureText is unavailable) and runs the recipe once per line,
 * positioning each SVG data-URI layer at its line rect like upstream's
 * MarkSvg (left: x-pad, top: y-pad, w+2pad × h+2pad, preserveAspectRatio
 * "none" comes from the padded viewBox).
 *
 * A component opts in with an instance field before attached:
 *   this.__markConfig = {
 *     recipe: 'highlight',          // RECIPES id (default selector .ll-mark)
 *     mode: 'lines' | 'box',        // box = one rect around all lines; a
 *                                   // function (d) => mode also works
 *     over: true,                   // z-index 1 (over the text) vs -1
 *     params: (d) => ({ ... }),     // component params (tone/weight/kind…)
 *     seedKey: (d) => 'extra',      // optional, folded into the seed
 *   };
 * and renders:
 *   <view class="ll-mark …">
 *     <text class="ll-mark__w" wx:for="{{markWords}}" wx:key="index">{{item}}</text>
 *     <view wx:for="{{markInk}}" wx:key="index" class="ll-mark__ink" style="{{item}}" />
 *   </view>
 */
import {
  RECIPES,
  GUESS_RATIOS,
  lineMetrics,
  runRecipe,
} from './ink-engine';
import { svgDataUri, hashSeed } from './ink';
import { onHandFontReady } from './hand-font';

const RUN_REQ = { tier: 'lo', density: 'comfortable', knobs: { wobble: 1, misreg: 1, bleed: 1, width: 1 }, dir: 'ltr' };

/** Round to 0.25px like upstream's q() (keeps the cache keys stable). */
const q = (v) => Math.round(v * 4) / 4;

/** Same visual line when tops sit within half of the shorter box (upstream
    mergeLineRects uses a 60%-height overlap on the merged rects; words of
    one line share near-identical tops, so the top test is enough). */
function groupLines(rects) {
  const lines = [];
  for (const r of rects) {
    const line = lines.find((L) => Math.abs(L.top - r.top) < 0.5 * Math.min(L.h, r.height));
    if (line) {
      line.left = Math.min(line.left, r.left);
      line.right = Math.max(line.right, r.left + r.width);
      line.top = Math.min(line.top, r.top);
      line.bottom = Math.max(line.bottom, r.top + r.height);
      line.h = Math.max(line.h, r.height);
    } else {
      lines.push({ left: r.left, right: r.left + r.width, top: r.top, bottom: r.top + r.height, h: r.height });
    }
  }
  return lines;
}

/** "a swipe of yellow" → ['a ', 'swipe ', 'of ', 'yellow'] (trailing spaces
    keep the inter-word gaps inside the measured spans; the merged line rect
    spans the gaps anyway). CJK runs (no spaces) split per character. */
export function splitWords(text) {
  const s = String(text ?? '');
  if (!s) return [];
  if (!/\s/.test(s) && /[^\x00-\x7f]/.test(s)) return s.split('');
  const parts = s.split(/ +/);
  return parts.map((w, i) => (i < parts.length - 1 ? `${w} ` : w)).filter(Boolean);
}

export function attachMark() {
  return Behavior({
    properties: {
      /** The marked text (the component renders it; slots can't be measured). */
      text: {
        type: String,
        value: '',
      },
      show: {
        type: Boolean,
        value: true,
      },
      /** Draw-on wipe per line (upstream MARK_WIPE clip-path animation),
          staggered 380ms per line like upstream's MarkSvg delay. */
      animate: {
        type: Boolean,
        value: false,
      },
      seed: {
        type: null,
        optionalTypes: [String, Number],
        value: '',
      },
    },
    data: {
      markWords: [],
      markInk: [],
      markReady: false,
    },
    lifetimes: {
      attached() {
        this.__markRetries = 0;
        this.__splitText();
        // The first measurement races the hand font (see common/ink.js).
        onHandFontReady(() => {
          if (this.__markDetached) return;
          setTimeout(() => this.__measureMark(), 50);
        });
      },
      detached() {
        this.__markDetached = true;
      },
    },
    observers: {
      text() {
        this.__splitText();
        this.__measureMark();
      },
      'show, seed, animate, tone, weight, kind, shape, cover, side, bleed, orientation'() {
        this.__measureMark();
      },
    },
    methods: {
      __splitText() {
        this.setData({ markWords: splitWords(this.data.text), markInk: [], markReady: false });
      },
      /** Host rect + word rects + computed font-size → merged line rects. */
      __measureMark() {
        const cfg = this.__markConfig;
        if (!cfg || !this.data.show) {
          this.setData({ markInk: [], markReady: false });
          return;
        }
        const query = this.createSelectorQuery();
        query.select('.ll-mark').boundingClientRect();
        query.selectAll('.ll-mark__w').boundingClientRect();
        query.select('.ll-mark').fields({ computedStyle: ['font-size'] });
        query.exec((res) => {
          if (this.__markDetached) return;
          const host = res[0];
          const words = res[1] || [];
          const fs = res[2] ? parseFloat(res[2]['font-size']) || 16 : 16;
          if (!host || !host.width || !host.height || !words.length) {
            // Not laid out yet — same retry ladder as attachInk (slot content
            // inside a wx:if reports null until it renders).
            const n = ++this.__markRetries;
            if (n < 300) setTimeout(() => this.__measureMark(), n <= 20 ? 50 : n <= 60 ? 250 : 1000);
            return;
          }
          this.__markRetries = 0;
          this.__renderMark(host, words, fs);
        });
      },
      __renderMark(host, words, fs) {
        const cfg = this.__markConfig;
        const d = this.data;
        // mode may depend on props (strike: kind 'cross' draws one box X).
        const mode = typeof cfg.mode === 'function' ? cfg.mode(d) : cfg.mode;
        // The ink layers' containing block is the host's FIRST line fragment
        // (upstream anchors a zero-size mark-origin span there), whose left
        // edge is the first word's start — not the union bounding rect (the
        // two differ whenever the mark starts mid-line and wraps). Measure
        // everything against that origin.
        const origin = words.find((r) => r.width >= 0.5 && r.height >= 0.5) || host;
        // Word rects → origin-relative line rects.
        const rel = words
          .filter((r) => r.width >= 0.5 && r.height >= 0.5)
          .map((r) => ({ left: r.left - origin.left, top: r.top - origin.top, width: r.width, height: r.height }));
        let rects = groupLines(rel).map((L) => ({
          x: q(L.left),
          y: q(L.top),
          w: q(L.right - L.left),
          h: q(L.bottom - L.top),
        }));
        if (mode === 'box') {
          const x0 = Math.min(...rects.map((r) => r.x));
          const x1 = Math.max(...rects.map((r) => r.x + r.w));
          const y0 = Math.min(...rects.map((r) => r.y));
          const y1 = Math.max(...rects.map((r) => r.y + r.h));
          rects = [{ x: q(x0), y: q(y0), w: q(x1 - x0), h: q(y1 - y0) }];
        }
        if (!rects.length) {
          this.setData({ markInk: [], markReady: false });
          return;
        }
        const recipe = RECIPES[cfg.recipe];
        if (!recipe) return;
        const seed = `${hashSeed(`${cfg.recipe}:${d.text}:${d.seed ?? ''}:${cfg.seedKey ? cfg.seedKey(d) : ''}`)}`;
        const layers = rects.map((r, i) => {
          // Box mode (circled/cross strike) metrics come from the text line
          // height, not the union box (upstream caps r.h at asc+desc × fs).
          const metricsH = mode === 'box' ? Math.min(r.h, Math.round((GUESS_RATIOS.asc + GUESS_RATIOS.desc) * fs)) : r.h;
          const params = {
            ...cfg.params(d),
            ...lineMetrics(metricsH, fs, GUESS_RATIOS),
            first: i === 0,
            last: i === rects.length - 1,
            n: rects.length,
          };
          const frame = runRecipe(recipe, { ...RUN_REQ, box: { w: r.w, h: r.h }, params, seed: `${seed}:${i}`, lazy: [] });
          const style =
            `left:${r.x - frame.pad}px;top:${r.y - frame.pad}px;` +
            `width:${r.w + frame.pad * 2}px;height:${r.h + frame.pad * 2}px;` +
            `z-index:${cfg.over ? 1 : -1};` +
            (d.animate ? `animation:ll-mark-wipe 0.5s ease-out ${i * 380}ms both;` : '') +
            `background-image:url("${svgDataUri(frame.parts.rest, frame)}");`;
          return style;
        });
        this.setData({ markInk: layers, markReady: true });
      },
    },
  });
}
