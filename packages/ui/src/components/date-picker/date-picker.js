import { createComponent } from '../../common/component';
import { props } from './props';

// ---------- date plumbing (strings only — no Date objects cross in) ----------
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const pad2 = (n) => (n < 10 ? '0' + n : '' + n);
const cmpIso = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const parseIso = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
  return m ? { y: +m[1], m: +m[2] - 1, d: +m[3] } : null;
};
const toIso = (p) => `${p.y}-${pad2(p.m + 1)}-${pad2(p.d)}`;
const validYmd = (y, m, d) => {
  if (y < 1000 || y > 9999) return null;
  const t = new Date(Date.UTC(y, m, d));
  if (t.getUTCMonth() !== m || t.getUTCDate() !== d) return null; // Feb 30 …
  return { y, m, d };
};
const addDays = (p, n) => {
  const t = new Date(Date.UTC(p.y, p.m, p.d + n));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth(), d: t.getUTCDate() };
};
const monthOf = (isoStr) => (isoStr ? isoStr.slice(0, 7) : '');

// ---------- formatting (the few date-fns patterns worth their keep) ----------
const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
const FORMATTERS = {
  P: (p) => `${pad2(p.m + 1)}/${pad2(p.d)}/${p.y}`, // MM/dd/yyyy (date-fns en-US)
  PP: (p) => `${MONTHS_SHORT[p.m]} ${p.d}, ${p.y}`,
  PPP: (p) => `${MONTHS[p.m]} ${p.d}, ${p.y}`,
  PPPP: (p) => `${MONTHS[p.m]}, ${ordinal(p.d)} ${p.y}`,
  'yyyy-MM-dd': (p) => toIso(p),
  'yyyy/M/d': (p) => `${p.y}/${p.m + 1}/${p.d}`,
  'M/d/yyyy': (p) => `${p.m + 1}/${p.d}/${p.y}`,
  'M/d/yy': (p) => `${p.m + 1}/${p.d}/${pad2(p.y % 100)}`,
  'd.M.yyyy': (p) => `${p.d}.${p.m + 1}.${p.y}`,
  'd.M.yy': (p) => `${p.d}.${p.m + 1}.${pad2(p.y % 100)}`,
  'MMM d, yyyy': (p) => `${MONTHS_SHORT[p.m]} ${p.d}, ${p.y}`,
  'MMMM d, yyyy': (p) => `${MONTHS[p.m]} ${p.d}, ${p.y}`,
  'MMM d yyyy': (p) => `${MONTHS_SHORT[p.m]} ${p.d} ${p.y}`,
  'MMMM d yyyy': (p) => `${MONTHS[p.m]} ${p.d} ${p.y}`,
  'MMM d': (p) => `${MONTHS_SHORT[p.m]} ${p.d}`,
  'd MMM yyyy': (p) => `${p.d} ${MONTHS_SHORT[p.m]} ${p.y}`,
  'd MMMM yyyy': (p) => `${p.d} ${MONTHS[p.m]} ${p.y}`,
};
const fmt = (p, f) => (FORMATTERS[f] || FORMATTERS.PP)(p);

// ---------- reading typed text (upstream parseDateInput) ----------
const monthFromWord = (w) => {
  const s = String(w || '').toLowerCase().replace(/\./g, '');
  if (!s) return -1;
  const full = MONTHS.findIndex((m) => m.toLowerCase() === s);
  if (full !== -1) return full;
  return MONTHS_SHORT.findIndex((m) => m.toLowerCase() === s.slice(0, 3)) !== -1 && s.length >= 3
    ? MONTHS_SHORT.findIndex((m) => m.toLowerCase() === s.slice(0, 3))
    : -1;
};
// [regex, groups → {y, m, d} | null] — tried after the requested format
const PATTERNS = [
  [/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/, (a, b, c) => validYmd(+a, +b - 1, +c)],
  [/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, (a, b, c) => validYmd(+c, +a - 1, +b)],
  [/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/, (a, b, c) => validYmd(+c, +b - 1, +a)],
  [/^([a-zA-Z]+)\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/, (a, b, c) => {
    const m = monthFromWord(a);
    return m === -1 ? null : validYmd(+c, m, +b);
  }],
  [/^(\d{1,2})(?:st|nd|rd|th)?\s+([a-zA-Z]+)\.?,?\s+(\d{4})$/, (a, b, c) => {
    const m = monthFromWord(b);
    return m === -1 ? null : validYmd(+c, m, +a);
  }],
];
/** Two-digit years sit within 50 years of the reference (1950–2049 without
    one) — upstream's date-fns pivot. */
const pivotYear = (yy, refY) => {
  const base = refY - 50;
  return base + ((yy - (base % 100) + 100) % 100);
};
const NUMERIC_YY = [
  [/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/, (a, b, yy, refY) => validYmd(pivotYear(+yy, refY), +a - 1, +b)],
  [/^(\d{1,2})\.(\d{1,2})\.(\d{2})$/, (a, b, yy, refY) => validYmd(pivotYear(+yy, refY), +b - 1, +a)],
];

function parseDateInput(text, format, todayIso) {
  const s = String(text || '').trim();
  if (!s) return null;
  const ref = parseIso(todayIso) || parseIso(toIso({ y: new Date().getFullYear(), m: new Date().getMonth(), d: new Date().getDate() }));
  const word = s.toLowerCase();
  if (word === 'today') return ref;
  if (word === 'tomorrow') return addDays(ref, 1);
  if (word === 'yesterday') return addDays(ref, -1);
  const tries = [format, 'yyyy-MM-dd', 'yyyy/M/d', 'M/d/yyyy', 'M/d/yy', 'd.M.yyyy', 'd.M.yy', 'MMM d, yyyy', 'MMMM d, yyyy', 'MMM d yyyy', 'MMMM d yyyy', 'd MMM yyyy', 'd MMMM yyyy'].filter(Boolean);
  for (const f of tries) {
    if (f === 'yyyy-MM-dd' || f === 'yyyy/M/d') {
      const m = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(s);
      if (m) { const p = validYmd(+m[1], +m[2] - 1, +m[3]); if (p) return p; }
    } else if (f === 'M/d/yyyy') {
      const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
      if (m) { const p = validYmd(+m[3], +m[1] - 1, +m[2]); if (p) return p; }
    } else if (f === 'M/d/yy') {
      const m = /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/.exec(s);
      if (m) { const p = validYmd(pivotYear(+m[3], ref.y), +m[1] - 1, +m[2]); if (p) return p; }
    } else if (f === 'd.M.yyyy') {
      const m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(s);
      if (m) { const p = validYmd(+m[3], +m[2] - 1, +m[1]); if (p) return p; }
    } else if (f === 'd.M.yy') {
      const m = /^(\d{1,2})\.(\d{1,2})\.(\d{2})$/.exec(s);
      if (m) { const p = validYmd(pivotYear(+m[3], ref.y), +m[2] - 1, +m[1]); if (p) return p; }
    } else if (f === 'MMM d, yyyy' || f === 'MMMM d, yyyy' || f === 'MMM d yyyy' || f === 'MMMM d yyyy') {
      const m = /^([a-zA-Z]+)\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/.exec(s);
      if (m) { const mm = monthFromWord(m[1]); const p = mm === -1 ? null : validYmd(+m[3], mm, +m[2]); if (p) return p; }
    } else if (f === 'd MMM yyyy' || f === 'd MMMM yyyy') {
      const m = /^(\d{1,2})(?:st|nd|rd|th)?\s+([a-zA-Z]+)\.?,?\s+(\d{4})$/.exec(s);
      if (m) { const mm = monthFromWord(m[2]); const p = mm === -1 ? null : validYmd(+m[3], mm, +m[1]); if (p) return p; }
    } else if (f === 'P') {
      const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
      if (m) { const p = validYmd(+m[3], +m[1] - 1, +m[2]); if (p) return p; }
    } else if (f === 'PP' || f === 'PPP') {
      const m = /^([a-zA-Z]+)\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/.exec(s);
      if (m) { const mm = monthFromWord(m[1]); const p = mm === -1 ? null : validYmd(+m[3], mm, +m[2]); if (p) return p; }
    }
  }
  return null;
}

const RANGE_SEPARATOR = /\s+(?:–|—|-|to)\s+|\s*[–—]\s*/;

/** ll-date-picker — upstream DatePicker + DateRangePicker folded into one
    component (mode 'single' | 'range'): the select field frame (same
    select recipe) around a real input and a ghost calendar button; the
    slip below holds the preset row and the ll-calendar. Typed text is read
    on Enter or blur (an unreadable date turns the box red until the next
    edit); presets are keywords ('today', 'in-a-week', …) so relative dates
    are worked out when chosen. Values cross as 'YYYY-MM-DD' strings. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'select',
    llInkSelector: '.ll-dp',
    shown: '',
    bad: false,
    hasValue: false,
    visible: false,
    closing: false,
    placed: false,
    panelStyle: '',
    calMonths: 1,
    calDisabled: [],
    ph: '',
    calLabel: 'Choose date',
  },
  observers: {
    'value, format, placeholder, min, max, disabledDates, calendarLabel, mode'() {
      this.__sync();
    },
    open(v) {
      if (v === true) this.__show();
      else if (v === false) this.__dismiss();
    },
    invalid() {
      if (typeof this.__renderInk === 'function') setTimeout(() => this.__renderInk(), 0);
    },
  },
  lifetimes: {
    attached() {
      const d = this.data;
      // selectRecipe params: the invalid layer replaces rest (field-frame
      // convention); disabled swaps in via attachInk's own path.
      this.__inkParams = () => ({ invalid: this.data.bad || !!this.data.invalid });
      if (!d.value && d.defaultValue) this.setData({ value: d.defaultValue });
      this.__sync();
      if (d.defaultOpen && (d.open === null || d.open === undefined)) this.__show();
    },
    detached() {
      if (this.__placeTimer) clearTimeout(this.__placeTimer);
      if (this.__exitTimer) clearTimeout(this.__exitTimer);
    },
  },
  methods: {
    noop() {},
    // ---------- value shape ----------
    __val() {
      const d = this.data;
      if (d.mode === 'range') {
        const v = Array.isArray(d.value) ? d.value : [];
        return { from: String(v[0] || ''), to: String(v[1] || '') };
      }
      return { from: String(d.value || ''), to: '' };
    },
    __today() {
      return this.data.today || toIso({ y: new Date().getFullYear(), m: new Date().getMonth(), d: new Date().getDate() });
    },
    __sync() {
      const d = this.data;
      const v = this.__val();
      const p = parseIso(v.from);
      let text = '';
      if (d.mode === 'range') {
        const a = parseIso(v.from);
        const b = parseIso(v.to);
        if (a) text = b ? `${fmt(a, d.format)} – ${fmt(b, d.format)}` : `${fmt(a, d.format)} –`;
      } else if (p) {
        text = fmt(p, d.format);
      }
      // calendar matchers: min/max + the page's extra disabledDates
      const calDisabled = [];
      if (d.min) calDisabled.push({ before: d.min });
      if (d.max) calDisabled.push({ after: d.max });
      for (const r of d.disabledDates || []) if (r) calDisabled.push(r);
      this.setData({
        shown: this.__draft && this.__draft.base === String(d.value) ? this.__draft.text : text,
        hasValue: !!(d.mode === 'range' ? v.from : v.from),
        calDisabled,
        ph: d.placeholder || (d.mode === 'range' ? 'Pick a date range' : 'Pick a date'),
        calLabel: d.calendarLabel || (d.mode === 'range' ? 'Choose dates' : 'Choose date'),
      });
    },
    __commitValue(next) {
      this.setData({ value: next, bad: false });
      this.__sync();
      this.triggerEvent('change', {
        value: next,
        ...(this.data.mode === 'range' ? { from: next[0] || '', to: next[1] || '' } : {}),
      });
    },
    // ---------- typed text ----------
    onInput(e) {
      this.__draft = { text: e.detail.value, base: String(this.data.value) };
      this.setData({ shown: e.detail.value, bad: false });
      if (typeof this.__renderInk === 'function') this.__renderInk();
    },
    onFocus() {
      // data-ink-focus="within" upstream: the frame lights its focus ring
      this.setData({ focusVisible: true });
      this.__applyInkLayer();
      this.triggerEvent('focus', {});
    },
    onBlur() {
      this.setData({ focusVisible: false });
      this.__applyInkLayer();
      this.__commitText();
      this.triggerEvent('blur', {});
    },
    onConfirm() {
      this.__commitText();
    },
    /** Read the draft; a day that cannot be read (or is hatched out) turns
        the box red until the next edit. */
    __commitText() {
      const d = this.data;
      const draft = this.__draft;
      this.__draft = null;
      if (!draft) return;
      const typed = draft.text;
      const v = this.__val();
      if (d.mode === 'range') {
        const cur = v.from ? (v.to ? `${fmt(parseIso(v.from), d.format)} – ${fmt(parseIso(v.to), d.format)}` : `${fmt(parseIso(v.from), d.format)} –`) : '';
        if (typed === cur) { this.__sync(); return; }
        const parts = typed.trim().split(RANGE_SEPARATOR).filter((p) => p.trim() !== '');
        if (parts.length < 1 || parts.length > 2) { this.__bad(); return; }
        const dates = parts.map((p) => parseDateInput(p, d.format, this.__today()));
        if (dates.some((x) => !x)) { this.__bad(); return; }
        let [a, b] = dates;
        if (b && cmpIso(toIso(b), toIso(a)) < 0) [a, b] = [b, a];
        const next = [toIso(a), b ? toIso(b) : ''];
        if (this.__hatched(next[0]) || this.__hatched(next[1])) { this.__bad(); return; }
        this.__commitValue(next);
        return;
      }
      const cur = v.from ? fmt(parseIso(v.from), d.format) : '';
      if (typed === cur) { this.__sync(); return; }
      if (!typed.trim()) { this.__commitValue(''); return; }
      const p = parseDateInput(typed, d.format, this.__today());
      if (!p || this.__hatched(toIso(p))) { this.__bad(); return; }
      this.__commitValue(toIso(p));
    },
    __bad() {
      this.setData({ bad: true });
      this.__sync();
      if (typeof this.__renderInk === 'function') this.__renderInk();
    },
    __hatched(isoStr) {
      if (!isoStr) return false;
      const d = this.data;
      const p = parseIso(isoStr);
      const dow = new Date(Date.UTC(p.y, p.m, p.d)).getUTCDay();
      for (const r of d.calDisabled) {
        if (r.before && cmpIso(isoStr, r.before) < 0) return true;
        if (r.after && cmpIso(isoStr, r.after) > 0) return true;
        if (r.dayOfWeek && r.dayOfWeek.indexOf(dow) !== -1) return true;
      }
      return false;
    },
    // ---------- open / close (select slip pattern) ----------
    onTriggerTap() {
      if (this.data.disabled || this.data.readOnly || this.data.closing) return;
      if (this.data.visible) {
        this.triggerEvent('openchange', { value: false });
        this.__dismiss();
      } else {
        this.triggerEvent('openchange', { value: true });
        this.__show();
      }
    },
    onOutsideTap() {
      this.triggerEvent('openchange', { value: false });
      this.__dismiss();
    },
    __show() {
      if (this.__exitTimer) {
        clearTimeout(this.__exitTimer);
        this.__exitTimer = null;
      }
      const info = wx.getSystemInfoSync();
      const vw = info.windowWidth || 375;
      // a range slip wants two months but the cells are fixed-width — drop
      // to one when the screen cannot hold them
      const want = this.data.mode === 'range' ? 2 : 1;
      const months = this.data.numberOfMonths > 0 ? Number(this.data.numberOfMonths) : vw >= 620 ? want : 1;
      const patch = { visible: true, closing: false, placed: false, calMonths: months };
      if (this.data.open === null || this.data.open === undefined) patch.open = true;
      this.setData(patch);
      setTimeout(() => this.__place(), 60);
    },
    __dismiss() {
      if (!this.data.visible || this.data.closing) return;
      const patch = { closing: true };
      if (this.data.open === null || this.data.open === undefined) patch.open = false;
      this.setData(patch);
      this.__exitTimer = setTimeout(() => {
        this.__exitTimer = null;
        this.setData({ visible: false, closing: false, placed: false });
      }, 150);
    },
    /** Popper placement: under the trigger (min-width = trigger width),
        flipped above when clipped, clamped to 8px margins. */
    __place() {
      this.createSelectorQuery()
        .select('.ll-dp')
        .boundingClientRect((rect) => {
          if (!rect) return;
          const info = wx.getSystemInfoSync();
          const vw = info.windowWidth || 375;
          const vh = info.windowHeight || 667;
          const GAP = 4;
          const MARGIN = 8;
          const spaceBelow = Math.max(0, vh - rect.bottom - GAP - MARGIN);
          const spaceAbove = Math.max(0, rect.top - GAP - MARGIN);
          let side = 'bottom';
          if (spaceBelow < 120 && spaceAbove > spaceBelow && rect.top > 0 && rect.bottom < vh) side = 'top';
          let left = Math.max(MARGIN, Math.min(rect.left, vw - MARGIN - rect.width));
          // clamp into the viewport — a fixed panel can't follow a trigger
          // scrolled past the fold (the 'top' side gets refined below)
          const top = Math.max(MARGIN, Math.min(side === 'bottom' ? rect.bottom + GAP : MARGIN, vh - MARGIN));
          const panelStyle = `left:${Math.round(left)}px;top:${Math.round(top)}px;min-width:${Math.round(rect.width)}px;max-width:${Math.round(vw - MARGIN * 2)}px;`;
          this.setData({ placed: true, panelStyle, side });
          // second hop: the panel's real height is known only once rendered —
          // sit above the field when flipped, and always clamp into view
          this.__placeTimer = setTimeout(() => {
            this.createSelectorQuery()
              .select('.ll-dp__panel')
              .boundingClientRect((p) => {
                if (!p) return;
                const vh2 = wx.getSystemInfoSync().windowHeight || 667;
                let top = side === 'top' ? rect.top - GAP - p.height : parseInt(this.data.panelStyle.match(/top:(-?[\d.]+)px/)[1], 10);
                if (p.height >= vh2 - MARGIN * 2) top = MARGIN;
                else top = Math.max(MARGIN, Math.min(top, vh2 - MARGIN - p.height));
                const style = this.data.panelStyle.replace(/top:-?[\d.]+px/, `top:${Math.round(top)}px;`);
                this.setData({ panelStyle: style });
              })
              .exec();
          }, 50);
        })
        .exec();
    },
    // ---------- slip interactions ----------
    onCalChange(e) {
      const d = this.data;
      if (d.mode === 'range') {
        const v = Array.isArray(e.detail.value) ? e.detail.value : [];
        const from = String(v[0] || '');
        const to = String(v[1] || '');
        this.__commitValue([from, to]);
        if (d.closeOnSelect && from && to && from !== to) {
          this.triggerEvent('openchange', { value: false });
          this.__dismiss();
        }
        return;
      }
      const next = String(e.detail.value || '');
      if (!next && this.__val().from && d.typeable) {
        // tapping the chosen day confirms it and puts the slip away — only
        // a field with typeable={false} clears it that way
        this.triggerEvent('openchange', { value: false });
        this.__dismiss();
        return;
      }
      this.__commitValue(next);
      if (d.closeOnSelect && next) {
        this.triggerEvent('openchange', { value: false });
        this.__dismiss();
      }
    },
    onPresetTap(e) {
      const d = this.data;
      const preset = (d.presets || [])[e.currentTarget.dataset.i];
      if (!preset) return;
      const today = parseIso(this.__today());
      const resolve = (val) => {
        if (val === 'today') return [toIso(today)];
        if (val === 'tomorrow') return [toIso(addDays(today, 1))];
        if (val === 'yesterday') return [toIso(addDays(today, -1))];
        if (val === 'in-a-week') return [toIso(addDays(today, 7))];
        if (val === 'next-month') {
          const m = today.m === 11 ? { y: today.y + 1, m: 0 } : { y: today.y, m: today.m + 1 };
          const d2 = Math.min(today.d, new Date(Date.UTC(m.y, m.m + 1, 0)).getUTCDate());
          return [toIso({ y: m.y, m: m.m, d: d2 })];
        }
        if (Array.isArray(val)) return [String(val[0] || ''), String(val[1] || '')];
        if (val && typeof val === 'object') return [String(val.from || ''), String(val.to || '')];
        return [String(val || '')];
      };
      const next = resolve(preset.value);
      this.__commitValue(d.mode === 'range' ? next : next[0] || '');
      const done = d.mode === 'single' ? !!next[0] : !!(next[0] && next[1] && next[0] !== next[1]);
      if (d.closeOnSelect && done) {
        this.triggerEvent('openchange', { value: false });
        this.__dismiss();
      }
    },
  },
});
