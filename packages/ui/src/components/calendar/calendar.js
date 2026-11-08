import { createComponent } from '../../common/component';
import { props } from './props';
import { renderLayers, hashSeed } from '../../common/ink';
import { bucketBox, ringTile, washTile, underlineTile, bandTile, hatchTile, RING_HANDS, UNDERLINE_HANDS, BAND_FRAMES } from '../../common/ink-engine';

// baked tokens (tiles are alpha masks here — color lives in the CSS
// backgrounds below; color-mix is unsupported on this side)
const INK_YOU = '#2c4f9e'; // --ll-ink-you
const MARKER = '#df6b3c'; // --ll-marker
const HI_SELECT = 'rgba(248,220,76,0.62)'; // --ll-hi-select
const PENCIL_MARK = '#8e887f'; // --ll-pencil-mark

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WD = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// day tiles are module-cached — same four ring hands etc. for every
// calendar, exactly like upstream's calendarCss cache
let TILES = null;
function tiles() {
  if (TILES) return TILES;
  const rings = [];
  const washes = [];
  const unders = [];
  for (let i = 0; i < RING_HANDS; i++) {
    rings.push(ringTile(`cal|ring|${i}`));
    washes.push(washTile(`cal|wash|${i}`));
  }
  for (let i = 0; i < UNDERLINE_HANDS; i++) unders.push(underlineTile(`cal|under|${i}`, i === 1));
  const bands = [];
  for (let f = 0; f < BAND_FRAMES; f++) {
    bands.push({
      mid: bandTile(`cal|band|${f}`, false, false),
      start: bandTile(`cal|band|${f}`, true, false),
      end: bandTile(`cal|band|${f}`, false, true),
      pill: bandTile(`cal|band|${f}`, true, true),
    });
  }
  TILES = { rings, washes, unders, bands, hatch: hatchTile('cal|hatch') };
  return TILES;
}

const mask = (t) =>
  `-webkit-mask-image:${t};mask-image:${t};-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-position:center;mask-position:center;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;`;

const pad2 = (n) => (n < 10 ? '0' + n : '' + n);
const iso = (y, m, d) => `${y}-${pad2(m + 1)}-${pad2(d)}`;
const parseIso = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
  return m ? { y: +m[1], m: +m[2] - 1, d: +m[3] } : null;
};
const parseMonth = (s) => {
  const m = /^(\d{4})-(\d{2})$/.exec(String(s || ''));
  return m ? { y: +m[1], m: +m[2] - 1 } : null;
};
const cmpIso = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const daysIn = (y, m) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();

function isoWeek(y, m, d) {
  const t = new Date(Date.UTC(y, m, d));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - y0) / 86400000 + 1) / 7);
}

/** ll-calendar — upstream Calendar (react-day-picker folded into one
    component): a ruled month grid on the calendar-grid recipe with the day
    tiles drawn as CSS masks — the selected day circled in marker (four
    hands, by date), range weeks swiped in one highlighter band per row
    (chisel ends, two frames), today underlined in blue felt, disabled days
    hatched out. Dates cross the boundary as 'YYYY-MM-DD' strings. The
    dropdown captions are the platform picker (ll-native-select); upstream
    locales/rtl/numerals have no runtime here and are deferred. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    months: [],
    monthValue: '', // 'YYYY-MM' of the first shown month
    yearOptions: [],
    monthOptions: [],
    prevDis: false,
    nextDis: false,
  },
  observers: {
    'mode, value, defaultMonth, today, disabled, startMonth, endMonth, numberOfMonths, showOutsideDays, showWeekNumber, captionLayout, weekStartsOn'() {
      this.__rebuild();
    },
  },
  lifetimes: {
    attached() {
      const t = new Date();
      this.__now = iso(t.getFullYear(), t.getMonth(), t.getDate());
      this.__month = null; // {y, m} — first shown month
      this.__rebuild();
      setTimeout(() => this.__paint(), 80);
      setTimeout(() => this.__paint(), 400);
    },
  },
  methods: {
    noop() {},
    // ---------- selection state ----------
    __sel() {
      const d = this.data;
      if (d.mode === 'range') {
        const v = Array.isArray(d.value) ? d.value : [];
        return { from: String(v[0] || ''), to: String(v[1] || ''), set: [] };
      }
      if (d.mode === 'multiple') {
        const v = Array.isArray(d.value) ? d.value : [];
        return { from: '', to: '', set: v.map(String) };
      }
      return { from: String(d.value || ''), to: '', set: [] };
    },
    __isDisabled(isoStr, dow) {
      const rules = this.data.disabled || [];
      for (const r of rules) {
        if (!r) continue;
        if (r.before && cmpIso(isoStr, r.before) < 0) return true;
        if (r.after && cmpIso(isoStr, r.after) > 0) return true;
        if (r.dayOfWeek && r.dayOfWeek.indexOf(dow) !== -1) return true;
      }
      return false;
    },
    // ---------- month matrix ----------
    __firstMonth() {
      const d = this.data;
      let m = parseMonth(d.defaultMonth);
      if (!m) {
        const s = this.__sel();
        const base = d.mode === 'single' ? parseIso(s.from) : parseIso(s.from) || parseIso(s.set[0]);
        const today = parseIso(d.today || this.__now);
        m = base || today || { y: new Date().getFullYear(), m: new Date().getMonth() };
      }
      this.__clampMonth(m);
      return m;
    },
    __clampMonth(m) {
      const s = parseMonth(this.data.startMonth);
      const e = parseMonth(this.data.endMonth);
      const k = m.y * 12 + m.m;
      if (s && k < s.y * 12 + s.m) {
        m.y = s.y;
        m.m = s.m;
      }
      if (e && k > e.y * 12 + e.m) {
        m.y = e.y;
        m.m = e.m;
      }
    },
    __rebuild() {
      const d = this.data;
      if (!this.__month) this.__month = this.__firstMonth();
      this.__clampMonth(this.__month);
      const T = tiles();
      const nMonths = Math.max(1, Number(d.numberOfMonths) || 1);
      const sel = this.__sel();
      const wso = Number(d.weekStartsOn) || 0;
      const today = d.today || this.__now;
      const months = [];
      for (let mi = 0; mi < nMonths; mi++) {
        const first = new Date(Date.UTC(this.__month.y, this.__month.m + mi, 1));
        const y = first.getUTCFullYear();
        const m = first.getUTCMonth();
        const lead = (new Date(Date.UTC(y, m, 1)).getUTCDay() - wso + 7) % 7;
        const dim = daysIn(y, m);
        const nWeeks = Math.ceil((lead + dim) / 7);
        const cells = [];
        for (let w = 0; w < nWeeks; w++) {
          const week = [];
          for (let c = 0; c < 7; c++) {
            const dayNum = w * 7 + c - lead + 1;
            // Date.UTC normalizes dayNum 0/-1/… into the neighboring month
            const date = new Date(Date.UTC(y, m, dayNum));
            const realY = date.getUTCFullYear();
            const realM = date.getUTCMonth();
            const outside = realM !== m || realY !== y;
            const dow = date.getUTCDay();
            const isoStr = iso(realY, realM, date.getUTCDate());
            const v = ((date.getUTCDate() % RING_HANDS) + RING_HANDS) % RING_HANDS;
            const selected =
              d.mode === 'multiple'
                ? sel.set.indexOf(isoStr) !== -1
                : d.mode === 'range'
                  ? false
                  : sel.from === isoStr;
            const disabled = this.__isDisabled(isoStr, dow);
            const cell = {
              k: `${mi}-${w}-${c}`,
              label: String(date.getUTCDate()),
              iso: isoStr,
              v,
              frame: w % BAND_FRAMES,
              outside,
              disabled,
              aria: `${MONTHS[m]} ${date.getUTCDate()}, ${y}`,
              btnCls: (outside ? ' ll-cal__btn--out' : '') + (disabled ? ' ll-cal__btn--dis' : ''),
              sel: selected,
            };
            if (isoStr === today && !outside) {
              cell.today = true;
              cell.todayStyle = `background:${INK_YOU};${mask(T.unders[v % UNDERLINE_HANDS])}`;
            }
            if (disabled) {
              cell.hatchStyle = `inset:6rpx;background:${PENCIL_MARK};opacity:0.55;${mask(T.hatch)}`;
            }
            if (selected && d.mode !== 'range') {
              cell.washStyle = `inset:0;background:rgba(223,107,60,0.26);${mask(T.washes[v])}`;
              cell.ringStyle = `inset:-6rpx;background:${MARKER};opacity:0.92;${mask(T.rings[v])}`;
            }
            week.push(cell);
          }
          cells.push({ k: `w${mi}-${w}`, wn: d.showWeekNumber ? isoWeek(+week[0].iso.slice(0, 4), +week[0].iso.slice(5, 7) - 1, +week[0].iso.slice(8, 10)) : 0, days: week });
        }
        // range band: one highlighter swipe per week-row, chisel ends on
        // the run's first/last cell (upstream ::before with band masks)
        if (d.mode === 'range') {
          for (const wk of cells) {
            const days = wk.days;
            days.forEach((cell, ci) => {
              const on =
                sel.from && sel.to && cmpIso(cell.iso, sel.from) >= 0 && cmpIso(cell.iso, sel.to) <= 0 && !cell.outside;
              if (!on) return;
              let prevOn = ci > 0 && !days[ci - 1].outside && sel.from && sel.to && cmpIso(days[ci - 1].iso, sel.from) >= 0 && cmpIso(days[ci - 1].iso, sel.to) <= 0;
              let nextOn = ci < 6 && !days[ci + 1].outside && sel.from && sel.to && cmpIso(days[ci + 1].iso, sel.from) >= 0 && cmpIso(days[ci + 1].iso, sel.to) <= 0;
              if (cell.iso === sel.from) prevOn = false;
              if (cell.iso === sel.to) nextOn = false;
              const kind = !prevOn && !nextOn ? 'pill' : !prevOn ? 'start' : !nextOn ? 'end' : 'mid';
              cell.bandStyle = `background:${HI_SELECT};${mask(T.bands[cell.frame][kind])}`;
              cell.btnCls += ' ll-cal__btn--range';
            });
          }
        }
        months.push({
          key: `${y}-${m}`,
          caption: `${MONTHS[m]} ${y}`,
          year: y,
          month: m,
          monthValue: String(m),
          yearValue: String(y),
          weekdays: WD.slice(wso).concat(WD.slice(0, wso)),
          weeks: cells,
          gridStyle: '',
        });
      }
      // dropdown option pools
      let monthOptions = [];
      let yearOptions = [];
      if (d.captionLayout === 'dropdown') {
        const sm = parseMonth(d.startMonth);
        const em = parseMonth(d.endMonth);
        const y0 = sm ? sm.y : this.__month.y - 4;
        const y1 = em ? em.y : this.__month.y + 4;
        for (let yy = y0; yy <= y1; yy++) yearOptions.push({ label: String(yy), value: String(yy) });
        for (let mm = 0; mm < 12; mm++) {
          const ym = this.__month.y * 12 + mm;
          const inR = (!sm || ym >= sm.y * 12 + sm.m) && (!em || ym <= em.y * 12 + em.m);
          monthOptions.push({ label: MONTHS_SHORT[mm], value: String(mm), disabled: !inR });
        }
      }
      this.setData({
        months,
        monthValue: `${this.__month.y}-${pad2(this.__month.m + 1)}`,
        monthOptions,
        yearOptions,
        prevDis: this.__navDisabled(-1),
        nextDis: this.__navDisabled(1),
      });
      setTimeout(() => this.__paint(), 0);
    },
    // ---------- grid ink (one host per month, renderLayers by hand) ----------
    __paint() {
      if (!this.data.ruled) return;
      this.createSelectorQuery()
        .selectAll('.ll-cal__table')
        .boundingClientRect((rects) => {
          if (!rects || !rects.length) return;
          const seed = `${hashSeed(`cal:${this.data.seed || ''}`)}`;
          const months = this.data.months;
          const patch = {};
          months.forEach((mo, i) => {
            const rect = rects[i];
            if (!rect || !rect.width || !rect.height) return;
            const entry = renderLayers(
              'calendar-grid',
              bucketBox(rect.width, rect.height),
              { rows: mo.weeks.length, weekNumbers: !!this.data.showWeekNumber },
              `${seed}|${i}`
            );
            if (entry && entry.uris.rest) {
              patch[`months[${i}].gridStyle`] = `inset:${-entry.pad}px;background-image:url("${entry.uris.rest}")`;
            }
          });
          if (Object.keys(patch).length) this.setData(patch);
        })
        .exec();
    },
    // ---------- interactions ----------
    onDayTap(e) {
      const isoStr = e.currentTarget.dataset.iso;
      const disabled = e.currentTarget.dataset.disabled;
      const d = this.data;
      if (disabled || !isoStr) return;
      if (d.mode === 'range') {
        const sel = this.__sel();
        let from = sel.from;
        let to = sel.to;
        if (!from || (from && to)) {
          from = isoStr;
          to = '';
        } else if (cmpIso(isoStr, from) < 0) {
          from = isoStr;
        } else {
          to = isoStr;
        }
        this.setData({ value: [from, to] });
        this.triggerEvent('change', { value: [from, to], from, to });
      } else if (d.mode === 'multiple') {
        const set = this.__sel().set.slice();
        const at = set.indexOf(isoStr);
        if (at === -1) set.push(isoStr);
        else set.splice(at, 1);
        set.sort(cmpIso);
        this.setData({ value: set });
        this.triggerEvent('change', { value: set });
      } else {
        const next = this.__sel().from === isoStr ? '' : isoStr;
        this.setData({ value: next });
        this.triggerEvent('change', { value: next });
      }
      this.__rebuild();
    },
    onPrev() {
      const m = this.__month;
      m.m -= 1;
      if (m.m < 0) {
        m.m = 11;
        m.y -= 1;
      }
      this.__clampMonth(m);
      this.__rebuild();
      this.triggerEvent('monthchange', { month: `${m.y}-${pad2(m.m + 1)}` });
    },
    onNext() {
      const m = this.__month;
      m.m += 1;
      if (m.m > 11) {
        m.m = 0;
        m.y += 1;
      }
      this.__clampMonth(m);
      this.__rebuild();
      this.triggerEvent('monthchange', { month: `${m.y}-${pad2(m.m + 1)}` });
    },
    onMonthPick(e) {
      const mm = Number(e.detail.value);
      const m = { y: this.__month.y, m: mm };
      this.__clampMonth(m);
      this.__month = m;
      this.__rebuild();
      this.triggerEvent('monthchange', { month: `${m.y}-${pad2(m.m + 1)}` });
    },
    onYearPick(e) {
      const yy = Number(e.detail.value);
      const m = { y: yy, m: this.__month.m };
      this.__clampMonth(m);
      this.__month = m;
      this.__rebuild();
      this.triggerEvent('monthchange', { month: `${m.y}-${pad2(m.m + 1)}` });
    },
    __navDisabled(dir) {
      const d = this.data;
      const m = this.__month;
      if (dir < 0) {
        const s = parseMonth(d.startMonth);
        return !!s && m.y * 12 + m.m <= s.y * 12 + s.m;
      }
      const e = parseMonth(d.endMonth);
      const n = Math.max(1, Number(d.numberOfMonths) || 1);
      return !!e && m.y * 12 + m.m + n - 1 >= e.y * 12 + e.m;
    },
  },
});
