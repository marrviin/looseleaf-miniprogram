import { createComponent } from '../../common/component';
import { props } from './props';

const HOLD_DELAY = 420;
const HOLD_EVERY = 90;

/** Upstream `Stepper` — one hand-drawn box (stepper recipe) around minus,
    a script-font number that is a real input, and plus. Pressing a button
    steps; holding it repeats after a pause; at a bound the box rattles.
    (Upstream's format/parse hooks are function props — here a prefix/suffix
    pair covers the unit cases; the input reads back plain numbers.) */
function decimals(n) {
  if (n === undefined || n === null || !Number.isFinite(n)) return 0;
  const s = String(n);
  if (s.includes('e-')) return Number(s.split('e-')[1]);
  const i = s.indexOf('.');
  return i < 0 ? 0 : s.length - i - 1;
}

/** Upstream parseNumber (the common cases): optional sign, digits with one
    point or one comma (either may be the decimal point), else thousands. */
function parseNumber(text) {
  const t = String(text).trim().replace(/[\s  ']/g, '');
  const m = /^([-+−]?)([\d.,]*)$/.exec(t);
  if (!m || !/\d/.test(m[2])) return undefined;
  const body = m[2];
  const dots = (body.match(/\./g) || []).length;
  const commas = (body.match(/,/g) || []).length;
  const point = dots && commas ? (body.lastIndexOf('.') > body.lastIndexOf(',') ? '.' : ',') : dots === 1 && !commas ? '.' : commas === 1 && !dots ? ',' : '';
  const group = point === '.' ? ',' : point === ',' ? '.' : dots > 1 ? '.' : commas > 1 ? ',' : '';
  const at = point ? body.lastIndexOf(point) : -1;
  const whole = at < 0 ? body : body.slice(0, at);
  const frac = at < 0 ? '' : body.slice(at + 1);
  if (!(group ? new RegExp(`^(\\d{1,3}(\\${group}\\d{3})*|\\d*)$`) : /^\d*$/).test(whole) || !/^\d*$/.test(frac)) return undefined;
  const n = Number(`${whole.replace(/[.,]/g, '') || '0'}${frac ? `.${frac}` : ''}`);
  return Number.isFinite(n) ? (m[1] === '-' || m[1] === '−' ? -n : n) : undefined;
}

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'stepper',
    llInkSelector: '.ll-stepper',
    inner: null, // the value (null = empty)
    shown: '', // formatted text in the input
    draft: null, // { text, base } while typing
    atMin: false,
    atMax: false,
    limit: 0, // rattle counter (alternates the shake keyframes)
    tick: '', // up-a/down-b tick animation of the number
    holding: 0, // -1 | 0 | 1
  },
  observers: {
    value(v) {
      if (v === null || v === undefined || Number.isFinite(Number(v))) this.__set(v === null || v === undefined ? null : Number(v), false);
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({ disabled: !!this.data.disabled, invalid: this.data.invalid && !this.data.disabled, plain: false });
      this.__latest = this.data.value != null ? Number(this.data.value) : this.data.defaultValue != null ? Number(this.data.defaultValue) : null;
      this.__set(this.__latest, false);
      this.__renderInkSoon();
    },
    detached() {
      this.__stopHold();
    },
  },
  methods: {
    __renderInkSoon() {
      setTimeout(() => this.__renderInk(), 50);
    },
    __places() {
      const d = this.data;
      return d.precision != null ? Number(d.precision) : Math.max(decimals(Number(d.step) || 1), decimals(d.min != null ? Number(d.min) : undefined));
    },
    __round(n) {
      const p = Math.min(Math.max(this.__places(), 0), 12);
      return Number(Number(n).toFixed(p));
    },
    __clamp(n) {
      const d = this.data;
      return Math.min(d.max != null ? Number(d.max) : Infinity, Math.max(d.min != null ? Number(d.min) : -Infinity, n));
    },
    __snapTo(n) {
      const d = this.data;
      if (!d.snap) return n;
      const origin = d.min != null ? Number(d.min) : 0;
      return origin + Math.round((n - origin) / (Number(d.step) || 1)) * (Number(d.step) || 1);
    },
    __format(n) {
      const d = this.data;
      if (n === null || n === undefined) return '';
      const body = d.precision != null ? Number(n).toFixed(Number(d.precision)) : String(this.__round(n));
      return `${d.prefix || ''}${body}${d.suffix || ''}`;
    },
    __set(next, fire) {
      this.__latest = next;
      const d = this.data;
      const has = next !== null && next !== undefined && Number.isFinite(next);
      this.setData({
        inner: has ? next : null,
        shown: this.__format(has ? next : null),
        atMin: has && d.min != null && next <= Number(d.min),
        atMax: has && d.max != null && next >= Number(d.max),
      });
      if (fire) this.triggerEvent('change', { value: has ? next : null });
    },
    __animate(dir) {
      const d = this.data;
      this.__limitN = (this.__limitN || 0) + 1;
      this.setData({ tick: `${dir === 1 ? 'up' : 'down'}-${this.__limitN % 2 ? 'a' : 'b'}` });
    },
    /** A button with nothing left nudges: the box rattles (alternating shake). */
    __nudge() {
      this.__limitN = (this.__limitN || 0) + 1;
      this.setData({ limit: this.__limitN });
      setTimeout(() => this.setData({ limit: 0 }), 400);
    },
    adjust(delta) {
      const d = this.data;
      if (d.disabled || d.readOnly) return;
      const from = this.__latest;
      const next = this.__clamp(this.__round(this.__snapTo((from ?? 0) + delta)));
      if (next === from) {
        if (delta !== 0) this.__nudge();
        return;
      }
      this.__animate(delta > 0 ? 1 : -1);
      this.__set(next, true);
    },
    jump(to) {
      const d = this.data;
      if (d.disabled || d.readOnly || to === undefined || to === this.__latest) return;
      this.__animate(this.__latest === null || to > this.__latest ? 1 : -1);
      this.__set(to, true);
    },
    commitText(text) {
      const d = this.data;
      if (String(text).trim() === '') {
        if (d.required) return false;
        this.__set(null, true);
        return true;
      }
      const n = parseNumber(text);
      if (n === undefined || !Number.isFinite(n)) return false;
      const next = this.__clamp(Number(this.__snapTo(n).toPrecision(12)));
      if (next !== this.__latest) this.__set(next, true);
      return true;
    },
    // --- buttons: press steps, hold repeats ---
    __off(dir) {
      const d = this.data;
      return d.disabled || d.readOnly || (dir === 1 ? d.atMax : d.atMin);
    },
    /** A real tap fires touchstart first; a synthetic tap (automation)
        doesn't — the guard keeps the fallback single-step for that case. */
    onDecTap() {
      if (Date.now() - (this.__touchedAt || 0) < 350) return;
      if (this.__off(-1)) {
        if (!this.data.disabled && !this.data.readOnly) this.__nudge();
        return;
      }
      this.adjust(-(Number(this.data.step) || 1));
    },
    onIncTap() {
      if (Date.now() - (this.__touchedAt || 0) < 350) return;
      if (this.__off(1)) {
        if (!this.data.disabled && !this.data.readOnly) this.__nudge();
        return;
      }
      this.adjust(Number(this.data.step) || 1);
    },
    onDecStart() {
      this.__touchedAt = Date.now();
      const d = this.data;
      if (this.__off(-1)) {
        if (!d.disabled && !d.readOnly) this.__nudge();
        return;
      }
      this.__holdDir = -1;
      this.setData({ holding: -1 });
      this.adjust(-(Number(d.step) || 1));
      this.__holdWait = setTimeout(() => {
        this.__holdRun = setInterval(() => {
          const before = this.__latest;
          this.adjust(this.__holdDir * (Number(d.step) || 1) * (this.__holdCount > 24 ? 5 : 1));
          this.__holdCount = (this.__holdCount || 0) + 1;
          if (this.__latest === before) this.__stopHold();
        }, HOLD_EVERY);
      }, HOLD_DELAY);
    },
    onIncStart() {
      this.__touchedAt = Date.now();
      const d = this.data;
      if (this.__off(1)) {
        if (!d.disabled && !d.readOnly) this.__nudge();
        return;
      }
      this.__holdDir = 1;
      this.setData({ holding: 1 });
      this.adjust(Number(d.step) || 1);
      this.__holdWait = setTimeout(() => {
        this.__holdRun = setInterval(() => {
          const before = this.__latest;
          this.adjust(this.__holdDir * (Number(d.step) || 1) * (this.__holdCount > 24 ? 5 : 1));
          this.__holdCount = (this.__holdCount || 0) + 1;
          if (this.__latest === before) this.__stopHold();
        }, HOLD_EVERY);
      }, HOLD_DELAY);
    },
    __stopHold() {
      clearTimeout(this.__holdWait);
      clearInterval(this.__holdRun);
      this.__holdCount = 0;
      if (this.data.holding) this.setData({ holding: 0 });
    },
    onDecEnd() {
      this.__stopHold();
    },
    onIncEnd() {
      this.__stopHold();
    },
    // --- the number input ---
    onInput(e) {
      this.setData({ draft: { text: e.detail.value, base: this.data.shown } });
      return e.detail.value;
    },
    onBlur(e) {
      const d = this.data;
      if (!d.draft || d.draft.base !== d.shown) {
        this.setData({ draft: null });
        return;
      }
      if (!this.commitText(d.draft.text)) {
        // a non-number is put back
        this.setData({ draft: null, shown: this.__format(this.data.inner) });
        return;
      }
      this.setData({ draft: null });
    },
    onConfirm(e) {
      this.onBlur(e);
    },
  },
});
