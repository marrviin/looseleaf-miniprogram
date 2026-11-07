import { createComponent } from '../../common/component';
import { renderLayers, hashSeed } from '../../common/ink';
import { bucketBox } from '../../common/ink-engine';
import { props } from './props';

const THUMB = 20; // px — matches the 40rpx thumb view; used by the clip window

/** Upstream `Slider` — three drawings, three hosts: the track recipe (groove
    + optional pencil ticks) on the measured track element, the range recipe
    (one marker pass, drawn full length) revealed by a CSS clip-path window,
    and a knob per value drawn by the thumb recipe at a fixed 20px box. No
    Radix here: the root handles touch itself (tap jumps the nearest thumb,
    drag follows the finger, `catchtouchmove` replaces touch-action:none). */
function tickIntervals(ticks, min, max, step) {
  if (!ticks) return 0;
  if (typeof ticks === 'number') return Math.max(0, Math.min(200, Math.round(ticks)));
  const n = Math.round((max - min) / step);
  return n >= 1 && n <= 20 ? n : 10;
}

/** Upstream fillWindow — the clip that reveals the full-length range drawing
    between the thumb centers (a/b as calc, 20px of thumb width reserved). */
function fillWindow(from, to, thumbAtFrom, { vertical, startsLow }) {
  const at = (pct, thumb) => `calc(${thumb ? THUMB / 2 : 0}px + (100% - ${thumb ? THUMB : 0}px) * ${pct / 100})`;
  const a = at(from, thumbAtFrom);
  const b = at(to, true);
  const inset = vertical
    ? startsLow
      ? `calc(100% - ${b}) -12px ${a} -12px`
      : `${a} -12px calc(100% - ${b}) -12px`
    : startsLow
      ? `-12px calc(100% - ${b}) -12px ${a}`
      : `-12px ${a} -12px calc(100% - ${b})`;
  return `clip-path:inset(${inset});`;
}

/** Thumb centers travel the groove inset by half a thumb at each end —
    at(pct, false) is the thumb's edge offset (center = that + 10px), the
    same math the clip window uses with thumb=true. */
const atPos = (pct) => `calc(0px + (100% - ${THUMB}px) * ${pct / 100})`;

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    // The track ink goes through the standard pipeline (measured element);
    // range + thumbs are drawn by hand below (upstream nests them in the
    // same DOM with their own recipes).
    llInkRecipe: 'slider-track',
    llInkSelector: '.ll-slider__track',
    values: [],
    thumbInks: [], // one ink style per thumb (rest + focus when focusVisible)
    thumbPos: [], // `left/top` (horizontal) or `bottom/left` (vertical) per thumb
    rangeClip: '',
  },
  observers: {
    value(v) {
      if (Array.isArray(v) && v.length) this.__setValues(v, false);
    },
    defaultValue(v) {
      if (!Array.isArray(this.data.value) && Array.isArray(v) && v.length) this.__setValues(v, false);
    },
    'min, max, step, inverted'() {
      this.__syncAll();
    },
    'tone, orientation, ticks'() {
      this.__syncAll();
    },
    'disabled, invalid'() {
      this.__syncAll();
    },
    seed() {
      this.__syncAll();
    },
    focusVisible() {
      this.__renderThumbs();
    },
  },
  lifetimes: {
    attached() {
      const v = Array.isArray(this.data.value) && this.data.value.length
        ? this.data.value
        : Array.isArray(this.data.defaultValue) && this.data.defaultValue.length
          ? this.data.defaultValue
          : [this.data.min];
      this.__setValues(v, false);
      // The native layout reports before the track settles (demo pages scroll
      // late) — redraw once it has, like the textarea's settle re-measures.
      setTimeout(() => this.__syncAll(), 50);
      setTimeout(() => this.__syncAll(), 300);
    },
  },
  methods: {
    __inkParams() {
      const d = this.data;
      return {
        vertical: d.orientation === 'vertical',
        ticks: tickIntervals(d.ticks, Number(d.min), Number(d.max), Number(d.step) || 1),
        disabled: !!d.disabled,
        invalid: !!d.invalid,
      };
    },
    __setValues(vals, fire) {
      const snap = (v) => {
        const step = Number(this.data.step) || 1;
        const clamped = Math.min(Number(this.data.max), Math.max(Number(this.data.min), Number(v) || 0));
        return Math.round((clamped - Number(this.data.min)) / step) * step + Number(this.data.min);
      };
      const values = vals.map(snap);
      this.setData({ values });
      if (fire) this.triggerEvent('changing', { value: values });
      this.__updateLayout();
    },
    __pcts(values) {
      const span = Number(this.data.max) - Number(this.data.min) || 1;
      return values.map((v) => Math.min(100, Math.max(0, ((v - Number(this.data.min)) / span) * 100)));
    },
    /** Thumb positions + the range clip — pure CSS math, no ink redraws. */
    __updateLayout() {
      const d = this.data;
      const vertical = d.orientation === 'vertical';
      const pcts = this.__pcts(d.values);
      const multi = pcts.length > 1;
      const from = multi ? Math.min(...pcts) : 0;
      const to = pcts.length ? Math.max(...pcts) : 0;
      const startsLow = !d.inverted; // ltr upstream — both orientations
      const thumbPos = pcts.map((p) =>
        vertical
          ? `bottom:${atPos(p)};left:50%;transform:translate(-50%,0);`
          : `left:${atPos(p)};top:50%;transform:translate(-50%,-50%);`
      );
      this.setData({ thumbPos, rangeClip: fillWindow(from, to, multi, { vertical, startsLow }) });
    },
    /** Measure the laid-out track, then (re)draw range + thumbs at its box. */
    __syncAll() {
      this.__measureInk(); // behavior pipeline — the track ink
      this.createSelectorQuery()
        .select('.ll-slider__track')
        .boundingClientRect((rect) => {
          if (!rect || !rect.width) return;
          this.__trackRect = { w: rect.width, h: rect.height };
          this.__renderRange();
          this.__renderThumbs();
        })
        .exec();
    },
    __renderRange() {
      const d = this.data;
      const r = this.__trackRect;
      if (!r) return;
      const seed = `${hashSeed(`slider-range|${d.seed ?? ''}|${Math.round(r.w)}x${Math.round(r.h)}`)}`;
      const entry = renderLayers(
        'slider-range',
        bucketBox(r.w, r.h),
        { vertical: d.orientation === 'vertical', tone: d.tone || 'marker', disabled: !!d.disabled },
        seed
      );
      if (!entry || !entry.uris.rest) return;
      this.__rangeInk = `inset:${-entry.pad}px;background-image:url("${entry.uris.rest}")`;
      this.setData({ rangeInk: this.__rangeInk });
    },
    __renderThumbs() {
      const d = this.data;
      const seedBase = d.seed ?? '';
      const disabled = !!d.disabled;
      const invalid = !!d.invalid;
      const thumbInks = d.values.map((_, i) => {
        const seed = `${hashSeed(`slider-thumb|${seedBase}|${i}`)}`;
        const entry = renderLayers('slider-thumb', bucketBox(THUMB, THUMB), { disabled, invalid }, seed);
        if (!entry) return '';
        // rest + focus stack over it (upstream's one-SVG model); WeChat has
        // no hover — the hover layer is reachable via the `hovered` prop only.
        const stack = [];
        if (d.focusVisible && entry.uris.focus) stack.push(entry.uris.focus);
        if (d.hovered && entry.uris.hover) stack.push(entry.uris.hover);
        stack.push(entry.uris.rest);
        return `inset:${-entry.pad}px;background-image:${stack.filter(Boolean).map((u) => `url("${u}")`).join(',')}`;
      });
      this.setData({ thumbInks });
    },
    /** Touch → value. Tap picks the nearest thumb (Radix: press anywhere on
        the groove); drag follows the finger along the track. */
    onTouchStart(e) {
      if (this.data.disabled) return;
      this.createSelectorQuery().select('.ll-slider__track').boundingClientRect((rect) => {
        if (!rect) return;
        this.__trackRect = { w: rect.width, h: rect.height, left: rect.left, top: rect.top };
        this.__activeThumb = this.__pickThumb(e);
        this.__applyTouch(e);
      }).exec();
    },
    onTouchMove(e) {
      if (this.data.disabled || this.__activeThumb === undefined) return;
      this.__applyTouch(e);
    },
    onTouchEnd() {
      if (this.data.disabled) return;
      this.__activeThumb = undefined;
      this.triggerEvent('change', { value: this.data.values });
    },
    __pickThumb(e) {
      const pcts = this.__pcts(this.data.values);
      const t = this.__touchPct(e.touches[0]);
      let best = 0;
      for (let i = 1; i < pcts.length; i++) {
        if (Math.abs(pcts[i] - t) < Math.abs(pcts[best] - t)) best = i;
      }
      return best;
    },
    __touchPct(touch) {
      const d = this.data;
      const vertical = d.orientation === 'vertical';
      const r = this.__trackRect;
      if (!r) return 0;
      const len = vertical ? r.h : r.w;
      // the thumb's center follows the finger along the inset groove
      const pos = vertical ? r.top + r.h - touch.clientY : touch.clientX - r.left;
      return Math.min(100, Math.max(0, ((pos - THUMB / 2) / (len - THUMB)) * 100));
    },
    __applyTouch(e) {
      const d = this.data;
      const step = Number(d.step) || 1;
      let v = Number(d.min) + (this.__touchPct(e.touches[0]) / 100) * (Number(d.max) - Number(d.min));
      v = Math.round(v / step) * step;
      // minStepsBetweenThumbs: keep the neighbors apart
      const i = this.__activeThumb;
      const gap = Number(d.minStepsBetweenThumbs) * step;
      if (gap > 0) {
        if (i > 0) v = Math.max(v, d.values[i - 1] + gap);
        if (i < d.values.length - 1) v = Math.min(v, d.values[i + 1] - gap);
      }
      const values = d.values.slice();
      values[i] = Math.min(Number(d.max), Math.max(Number(d.min), v));
      this.__setValues(values, true);
    },
  },
});
