import { createComponent } from '../../common/component';
import { props } from './props';
import { renderLayers, hashSeed } from '../../common/ink';
import {
  bucketBox,
  buildXYRows,
  toNum,
  layoutChart,
  hitIndex,
  formatCompact,
  formatNumber,
  shares,
  radarRim,
  lttb,
  slotKey,
  PATTERNS,
  MARKERS,
  DASHES,
  buildCalendar,
  buildGrid,
} from '../../common/ink-engine';

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const MONTHS_S = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const fmtDay = (ms, year) => {
  if (!isNum(ms)) return '';
  const d = new Date(ms);
  return `${WEEKDAYS[d.getUTCDay()]}, ${MONTHS_S[d.getUTCMonth()]} ${d.getUTCDate()}${year ? `, ${d.getUTCFullYear()}` : ''}`;
};

/** seriesLook lives inside buildXYRows upstream; the polar/legend paths use
    it too, so it is replicated here against the same tables. */
function autoLook(kind, slot, drawn, patterns) {
  const pat = PATTERNS[((slot % PATTERNS.length) + PATTERNS.length) % PATTERNS.length];
  const shifted = PATTERNS[(((slot + 1) % PATTERNS.length) + PATTERNS.length) % PATTERNS.length];
  const many = drawn > 1 || patterns === true;
  if (patterns === false) return { pattern: 'solid', marker: 'circle', dash: 'solid' };
  return {
    pattern: kind === 'area' ? shifted : kind === 'bar' ? (many ? pat : 'solid') : 'solid',
    marker: many ? MARKERS[((slot % MARKERS.length) + MARKERS.length) % MARKERS.length] : 'circle',
    dash: many ? DASHES[((slot % DASHES.length) + DASHES.length) % DASHES.length] : 'solid',
  };
}
function seriesLook(kind, slot, count, patterns, own) {
  const auto = autoLook(kind, slot, count, patterns);
  if (patterns === false) return auto;
  return {
    pattern: own && own.pattern && own.pattern !== 'auto' ? own.pattern : auto.pattern,
    marker: own && own.marker && own.marker !== 'auto' ? own.marker : auto.marker,
    dash: own && own.dash && own.dash !== 'auto' ? own.dash : auto.dash,
  };
}

/** ll-chart — upstream chart.tsx (the whole chart family) folded into one
    component. Every chart draws itself with the ink engine: the spec is
    built here from plain rows (buildXYRows + the per-type bodies), laid
    out at the measured stage (layoutChart) and rendered as one SVG
    data-URI behind real DOM labels (ChartLabels). Taps hit-test the
    targets (hitIndex) and light chart-mark cursors with a tooltip slip;
    legend buttons toggle series off (a rebuild, like upstream's hidden
    set). Upstream's keyboard model, streaming and custom function
    formatters have no runtime here and are deferred. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    stageStyle: '',
    labels: [],
    cursorBehind: [],
    cursorAbove: [],
    tip: null,
    center: null,
    legendRows: [],
    summary: '',
  },
  observers: {
    'type, data, xKey, series, sizeKey, config, kinds, stacked, horizontal, curve, domain, zero, dots, showValues, showGrid, showXAxis, showYAxis, annotations, references, highlights, patterns, nameKey, valueKey, innerRadius, startAngle, showLabels, max, levels, fill, endAngle, value, min, zones, sweep, gaugeTicks, sparkVariant, dataKey, ends, extremes, palette, unit, variant, dateKey, heatValueKey, weeks, end, weekStart, rowKey, colKey, rowLabels, colLabels, heatLevels, thresholds, heatUnit, showLegend, legend, defaultHiddenSeries, loading, emptyText, seed'() {
      if (!this.__ready) return;
      this.__rebuild();
    },
  },
  lifetimes: {
    attached() {
      this.__hidden = new Set(this.data.hiddenSeries || this.data.defaultHiddenSeries || []);
      this.__ready = true;
      this.__rebuild();
      setTimeout(() => this.__paint(), 80);
      setTimeout(() => this.__paint(), 400);
    },
    detached() {
      this.__dead = true;
    },
  },
  methods: {
    noop() {},
    // ---------- rows / keys ----------
    __rows() {
      return this.data.data || [];
    },
    __inferXKey() {
      const rows = this.__rows().slice(0, 12);
      for (const r of rows) {
        for (const k of Object.keys(r || {})) {
          const v = r[k];
          if (v !== null && typeof v !== 'number' && typeof v !== 'boolean') return k;
        }
      }
      return 'name';
    },
    __numericKeys() {
      const rows = this.__rows().slice(0, 12);
      const numeric = (k) => rows.some((r) => isNum(toNum(r ? r[k] : null)));
      const cfg = this.__cfg();
      const fromCfg = Object.keys(cfg).filter((k) => k !== this.__xk && numeric(k));
      if (fromCfg.length) return fromCfg;
      const keys = [];
      for (const r of rows) {
        for (const k of Object.keys(r || {})) {
          if (k !== this.__xk && keys.indexOf(k) === -1 && numeric(k)) keys.push(k);
        }
      }
      return keys;
    },
    __cfg() {
      return this.data.config && typeof this.data.config === 'object' ? this.data.config : {};
    },
    __labelOf(key, fallback) {
      const l = this.__cfg()[key] && this.__cfg()[key].label;
      return typeof l === 'string' || typeof l === 'number' ? String(l) : fallback;
    },
    __slotOf(key, fallback) {
      const keys = Object.keys(this.__cfg());
      const at = keys.indexOf(key);
      return at >= 0 ? at : fallback;
    },
    __seriesKeys() {
      const d = this.data;
      if (d.series && d.series.length) return d.series.map(String);
      if (d.type === 'pie' || d.type === 'donut') {
        const nk = d.nameKey || this.__inferXKey();
        return this.__rows().map((r, i) => String((r || {})[nk] ?? i));
      }
      return this.__numericKeys();
    },
    __resolveZero() {
      const d = this.data;
      if (typeof d.zero === 'boolean') return d.zero;
      const keys = this.__seriesKeys();
      const kinds = d.kinds || {};
      const t = d.type;
      return keys.some((k) => (kinds[k] || t) === 'bar' || (kinds[k] || t) === 'area');
    },
    __stateOf(ready) {
      const d = this.data;
      return d.loading ? 'loading' : ready ? 'ready' : 'empty';
    },
    // ---------- spec builders (upstream chart.tsx bodies) ----------
    __buildSpec() {
      const d = this.data;
      const t = d.type;
      if (t === 'pie' || t === 'donut') return this.__buildPie();
      if (t === 'radar') return this.__buildRadar();
      if (t === 'radial') return this.__buildRadial();
      if (t === 'gauge') return this.__buildGauge();
      if (t === 'sparkline') return this.__buildSpark();
      if (t === 'tally') return this.__buildTally();
      if (t === 'heat') return this.__buildHeat();
      return this.__buildXY(t === 'scatter' ? 'scatter' : t === 'line' ? 'line' : t === 'area' ? 'area' : 'bar');
    },
    __buildXY(kind) {
      const d = this.data;
      this.__xk = d.xKey || this.__inferXKey();
      const cfg = this.__cfg();
      const keys = this.__seriesKeys();
      const kinds = d.kinds || {};
      const inputs = keys.map((k, i) => {
        const c = cfg[k] || {};
        return {
          key: k,
          name: this.__labelOf(k, k),
          slot: this.__slotOf(k, i),
          kind: kinds[k] || kind,
          pattern: c.pattern,
          marker: c.marker,
          dash: c.dash,
        };
      });
      const built = buildXYRows({
        rows: this.__rows(),
        xKey: this.__xk,
        series: inputs,
        kind,
        stacked: d.stacked,
        horizontal: d.horizontal,
        curve: d.curve,
        domain: d.domain || undefined,
        zero: this.__resolveZero(),
        dots: d.dots,
        sizeKey: d.sizeKey || undefined,
        values: d.showValues,
        grid: d.showGrid,
        showX: d.showXAxis,
        showY: d.showYAxis,
        notes: d.annotations,
        refs: d.references,
        bands: d.highlights,
        patterns: d.patterns,
        hidden: Array.from(this.__hidden),
        state: d.loading ? 'loading' : undefined,
        stateText: d.loading ? 'Loading' : d.emptyText,
      });
      this.__built = built;
      this.__inputs = inputs;
      this.__noun = built.spec.series.some((s) => s.kind !== kind)
        ? 'Chart'
        : kind === 'scatter'
          ? 'Scatter chart'
          : kind === 'bar'
            ? 'Bar chart'
            : kind === 'line'
              ? 'Line chart'
              : 'Area chart';
      return built.spec;
    },
    __buildPie() {
      const d = this.data;
      const nk = d.nameKey || this.__inferXKey();
      const vk = d.valueKey || this.__numericKeys()[0] || 'value';
      this.__xk = nk;
      const all = this.__rows().map((r, i) => {
        const key = String((r || {})[nk] ?? i);
        return { key, name: this.__labelOf(key, key), slot: this.__slotOf(key, i), value: toNum((r || {})[vk]) ?? 0 };
      });
      const drawn = all.filter((s) => !this.__hidden.has(s.key));
      const inner = d.innerRadius != null ? d.innerRadius : d.type === 'donut' ? 0.58 : 0;
      this.__allSlices = all;
      this.__noun = inner > 0 ? 'Donut chart' : 'Pie chart';
      return {
        type: 'pie',
        slices: drawn.map((s) => {
          const c = this.__cfg()[s.key] || {};
          return {
            key: s.key,
            name: s.name,
            slot: s.slot,
            value: s.value,
            pattern: d.patterns === false || all.length < 2 ? 'solid' : c.pattern && c.pattern !== 'auto' ? c.pattern : PATTERNS[s.slot % PATTERNS.length],
          };
        }),
        inner,
        start: d.startAngle ?? 0,
        labels: d.showLabels,
        patterns: d.patterns !== false,
        state: this.__stateOf(drawn.reduce((n, s) => n + s.value, 0) > 0),
        stateText: d.loading ? 'Loading' : d.emptyText,
      };
    },
    __buildRadar() {
      const d = this.data;
      this.__xk = d.xKey || this.__inferXKey();
      const keys = this.__seriesKeys();
      const cfg = this.__cfg();
      const rows = this.__rows();
      const levels = d.levels ?? 4;
      let top = 0;
      for (const k of keys) for (const r of rows) top = Math.max(top, toNum((r || {})[k]) ?? 0);
      const rim = d.max != null ? d.max : radarRim(top, levels);
      const drawn = keys.filter((k) => !this.__hidden.has(k));
      this.__noun = 'Radar chart';
      return {
        type: 'radar',
        axes: rows.map((r) => String((r || {})[this.__xk] ?? '')),
        series: drawn.map((k) => {
          const slot = this.__slotOf(k, keys.indexOf(k));
          const look = seriesLook('area', slot, keys.length, d.patterns, cfg[k] || {});
          return { key: k, name: this.__labelOf(k, k), slot, pattern: look.pattern, marker: look.marker, values: rows.map((r) => toNum((r || {})[k])) };
        }),
        max: rim,
        levels,
        ringLabels: Array.from({ length: levels }, (_, l) => formatCompact((rim * (levels - l)) / levels)),
        fill: d.fill,
        patterns: d.patterns !== false,
        dots: d.dots !== false,
        state: this.__stateOf(!!drawn.length && rows.length >= 3),
        stateText: d.loading ? 'Loading' : d.emptyText,
      };
    },
    __buildRadial() {
      const d = this.data;
      const nk = d.nameKey || this.__inferXKey();
      const vk = d.valueKey || this.__numericKeys()[0] || 'value';
      this.__xk = nk;
      const all = this.__rows().map((r, i) => {
        const key = String((r || {})[nk] ?? i);
        return { key, name: this.__labelOf(key, key), slot: this.__slotOf(key, i), value: toNum((r || {})[vk]) ?? 0, max: toNum((r || {}).max) ?? (d.max != null ? d.max : 100) };
      });
      const drawn = all.filter((a) => !this.__hidden.has(a.key));
      this.__noun = 'Radial bar chart';
      return {
        type: 'radial',
        rings: drawn.map((a) => ({ key: a.key, name: a.name, slot: a.slot, pattern: d.patterns === false || all.length < 2 ? 'solid' : PATTERNS[a.slot % PATTERNS.length], value: a.value, max: a.max })),
        start: d.startAngle ?? 0,
        end: d.endAngle ?? 270,
        patterns: d.patterns !== false,
        state: this.__stateOf(!!drawn.length),
        stateText: d.loading ? 'Loading' : d.emptyText,
      };
    },
    __buildGauge() {
      const d = this.data;
      const TONE = { good: 2, warn: 3, bad: 5, info: 1, brand: 0 };
      const zones = d.zones || [];
      this.__noun = 'Gauge';
      return {
        type: 'gauge',
        value: isNum(d.value) ? d.value : d.min ?? 0,
        min: d.min ?? 0,
        max: d.max ?? 100,
        zones: zones.map((z, k) => ({ to: z.to, slot: typeof z.tone === 'number' ? z.tone : TONE[z.tone || ['good', 'warn', 'bad'][k % 3]], pattern: PATTERNS[k % PATTERNS.length] })),
        sweep: d.sweep ?? 180,
        ticks: d.gaugeTicks ?? 10,
        minLabel: formatNumber(d.min ?? 0),
        maxLabel: formatNumber(d.max ?? 100),
        patterns: d.patterns !== false,
        state: d.loading ? 'loading' : 'ready',
      };
    },
    __buildSpark() {
      const d = this.data;
      const raw = this.__rows().map((v) => (v !== null && typeof v === 'object' ? toNum(v[d.dataKey || 'value']) : toNum(v)));
      const values = raw.length > 600 ? lttb(raw.map((v, i) => [i, v ?? 0]), 600).map((i) => raw[i]) : raw;
      const real = values.filter(isNum);
      const lo = real.length ? Math.min.apply(null, real) : 0;
      const hi = real.length ? Math.max.apply(null, real) : 1;
      const pad = d.sparkVariant === 'bar' ? 0 : (hi - lo || 1) * 0.04;
      this.__noun = 'Trend';
      return {
        type: 'spark',
        variant: d.sparkVariant,
        values,
        min: d.sparkVariant === 'bar' ? Math.min(0, lo) : lo - pad,
        max: hi + pad,
        slot: d.palette != null ? d.palette : 0,
        ends: d.ends,
        extremes: d.extremes,
        state: this.__stateOf(!!real.length),
        stateText: d.loading ? 'Loading' : d.emptyText,
      };
    },
    __buildTally() {
      const d = this.data;
      const nk = d.nameKey || this.__inferXKey();
      const vk = d.valueKey || this.__numericKeys()[0] || 'value';
      this.__xk = nk;
      const all = this.__rows().map((r, i) => {
        const key = String((r || {})[nk] ?? i);
        return { key, name: this.__labelOf(key, key), slot: this.__slotOf(key, i), count: Math.max(0, Math.round(toNum((r || {})[vk]) ?? 0)) };
      });
      const drawn = all.filter((a) => !this.__hidden.has(a.key));
      this.__noun = 'Tally chart';
      return {
        type: 'tally',
        rows: drawn.map((a) => ({ key: a.key, name: a.name, slot: a.slot, count: a.count })),
        unit: d.unit ?? 0,
        totals: drawn.map((a) => formatNumber(a.count)),
        state: this.__stateOf(!!drawn.length),
        stateText: d.loading ? 'Loading' : d.emptyText,
      };
    },
    __buildHeat() {
      const d = this.data;
      const sl = d.palette != null ? d.palette : 2;
      const lv = d.heatLevels ?? 5;
      const rowsIn = this.__rows();
      let cells;
      if (d.variant === 'grid') {
        cells = buildGrid(
          rowsIn.map((r) => ({ row: (r || {})[d.rowKey || 'row'], col: (r || {})[d.colKey || 'col'], value: (r || {})[d.heatValueKey || 'value'] })),
          { rows: d.rowLabels, cols: d.colLabels, levels: lv, thresholds: d.thresholds },
        );
      } else {
        cells = buildCalendar(
          rowsIn.map((r) => ({ date: (r || {})[d.dateKey || 'date'], value: (r || {})[d.heatValueKey || 'value'] })),
          { weeks: d.weeks, end: d.end || undefined, weekStart: d.weekStart ?? 0, levels: lv, thresholds: d.thresholds },
        );
      }
      this.__heatCells = cells;
      this.__noun = d.variant === 'grid' ? 'Heat map' : 'Calendar heat map';
      return {
        type: 'heat',
        cols: cells.cols,
        rows: cells.rows,
        levels: cells.levels,
        levelCount: lv,
        colLabels: cells.colLabels,
        rowLabels: cells.rowLabels,
        slot: sl,
        variant: d.variant,
        legend: d.showLegend ? { less: 'Less', more: 'More' } : null,
        patterns: d.patterns !== false,
        state: this.__stateOf(cells.levels.some((l) => l >= 0)),
        stateText: d.loading ? 'Loading' : d.emptyText,
      };
    },
    // ---------- summaries (upstream's strings) ----------
    __summary(spec) {
      const d = this.data;
      const fmt = formatNumber;
      const desc = d.description ? ` ${d.description}` : '';
      const named = d.label ? `${d.label}. ` : '';
      const name = d.label || this.__noun;
      if (spec.state === 'loading') return `${name}. Loading.`;
      if (spec.state === 'empty') return `${name}. ${d.emptyText || 'No data.'}`;
      const t = spec.type;
      if (t === 'xy') {
        const scatter = spec.series.some((s) => s.kind === 'scatter');
        const count = scatter ? spec.series.reduce((n, s) => n + s.values.filter(isNum).length, 0) : spec.cats.length;
        if (!spec.series.length || !count) return `${name}. No data.`;
        const unit = scatter
          ? `${count} point${count === 1 ? '' : 's'}`
          : `${count} categor${count === 1 ? 'y' : 'ies'}${count > 1 ? ` from ${spec.cats[0]} to ${spec.cats[spec.cats.length - 1]}` : ` (${spec.cats[0]})`}`;
        const parts = spec.series.map((s) => {
          const nums = s.values.map((v, i) => [v, i]).filter((e) => isNum(e[0]));
          if (!nums.length) return `${s.name}: no values`;
          const lo = nums.reduce((a, b) => (b[0] < a[0] ? b : a));
          const hi = nums.reduce((a, b) => (b[0] > a[0] ? b : a));
          const at = (e) => (scatter ? '' : ` in ${spec.cats[e[1]]}`);
          return nums.length === 1 ? `${s.name}: ${fmt(nums[0][0])}` : `${s.name}: from ${fmt(lo[0])}${at(lo)} to ${fmt(hi[0])}${at(hi)}`;
        });
        const extra = (spec.stacked ? ' Stacked.' : spec.horizontal ? ' Horizontal bars.' : '') + (spec.total ? ` Thinned from ${formatNumber(spec.total)} rows to keep the drawing readable.` : '');
        return `${named}${this.__noun} with ${spec.series.length} series (${spec.series.map((s) => s.name).join(', ')}) and ${unit}.${extra} ${parts.join('. ')}.${desc}`.replace(/\.\./g, '.');
      }
      if (t === 'pie') {
        const total = spec.slices.reduce((n, s) => n + s.value, 0);
        const sh = shares(spec.slices.map((s) => s.value));
        const parts = spec.slices.map((s, i) => `${s.name} ${fmt(s.value)} (${sh[i]})`);
        return `${named}${this.__noun} of ${spec.slices.length} slice${spec.slices.length === 1 ? '' : 's'}, total ${fmt(total)}: ${parts.join(', ')}.${desc}`;
      }
      if (t === 'radar') {
        const each = spec.series.map((s) => `${s.name}: ${spec.axes.map((a, i) => `${a} ${isNum(s.values[i]) ? fmt(s.values[i]) : 'none'}`).join(', ')}`);
        return `${named}Radar chart with ${spec.axes.length} axes and ${spec.series.length} series, scaled to ${fmt(spec.max)}. ${each.join('. ')}.${desc}`;
      }
      if (t === 'radial') {
        return `${named}Radial bar chart with ${spec.rings.length} ring${spec.rings.length === 1 ? '' : 's'}: ${spec.rings.map((r) => `${r.name} ${fmt(r.value)} of ${fmt(r.max)}`).join(', ')}.${desc}`;
      }
      if (t === 'gauge') {
        return `${named}Gauge reading ${fmt(spec.value)} on a scale from ${fmt(spec.min)} to ${fmt(spec.max)}.${desc}`;
      }
      if (t === 'spark') {
        const real = spec.values.filter(isNum);
        const trend = real.length > 1 ? (real[real.length - 1] > real[0] ? 'rising' : real[real.length - 1] < real[0] ? 'falling' : 'flat') : 'flat';
        return `${name}: ${real.length} points from ${fmt(real[0])} to ${fmt(real[real.length - 1])}, lowest ${fmt(Math.min.apply(null, real))}, highest ${fmt(Math.max.apply(null, real))}, ${trend}.`;
      }
      if (t === 'tally') {
        return `${named}Tally chart: ${spec.rows.map((r) => `${r.name} ${fmt(r.count)}`).join(', ')}.${desc}`;
      }
      if (t === 'heat') {
        const cells = this.__heatCells;
        const total = cells.values.reduce((n, v) => n + (isNum(v) ? v : 0), 0);
        return `${named}${d.variant === 'grid' ? 'Heat map' : 'Calendar heat map'} of ${cells.levels.filter((l) => l >= 0).length} ${d.variant === 'grid' ? 'cells' : 'days'}, total ${fmt(total)}${d.heatUnit ? ` ${d.heatUnit}` : ''}, busiest ${fmt(cells.max)}.${desc}`;
      }
      return `${name}.${desc}`;
    },
    // ---------- legend ----------
    __legendRows() {
      const d = this.data;
      const t = d.type;
      const keys = this.__legendKeys();
      const show = d.legend != null ? d.legend : keys.length > (t === 'pie' || t === 'donut' ? 0 : 1);
      if (!show) return [];
      return keys.map((e) => {
        const seed = `${hashSeed(`swatch-${e.slot}-${e.pattern}-${e.marker ?? 'x'}-${e.line ? 'l' : 'b'}:${d.seed || ''}:${e.key}`)}`;
        const entry = renderLayers('chart-mark', e.line ? bucketBox(22, 14) : bucketBox(14, 14), { kind: 'swatch', slot: e.slot, pattern: e.pattern, marker: e.marker, line: !!e.line }, seed);
        const ink = entry && entry.uris.rest ? `inset:${-entry.pad}px;background-image:url("${entry.uris.rest}");` : '';
        return { key: e.key, name: e.name, line: !!e.line, off: this.__hidden.has(e.key), ink };
      });
    },
    __legendKeys() {
      const d = this.data;
      const t = d.type;
      if (t === 'pie' || t === 'donut') {
        const all = this.__allSlices || [];
        return all.map((s) => ({
          key: s.key,
          name: s.name,
          slot: s.slot,
          pattern: d.patterns === false || all.length < 2 ? 'solid' : PATTERNS[s.slot % PATTERNS.length],
          marker: 'circle',
          line: false,
        }));
      }
      if (t === 'radar') {
        const keys = this.__seriesKeys();
        const cfg = this.__cfg();
        return keys.map((k) => {
          const slot = this.__slotOf(k, keys.indexOf(k));
          const look = seriesLook('area', slot, keys.length, d.patterns, cfg[k] || {});
          return { key: k, name: this.__labelOf(k, k), slot, pattern: look.pattern, marker: look.marker, line: true };
        });
      }
      if (t === 'radial') {
        const nk = d.nameKey || this.__inferXKey();
        const all = this.__rows();
        return all.map((r, i) => {
          const key = String((r || {})[nk] ?? i);
          return { key, name: this.__labelOf(key, key), slot: this.__slotOf(key, i), pattern: d.patterns === false || all.length < 2 ? 'solid' : PATTERNS[this.__slotOf(key, i) % PATTERNS.length], marker: 'circle', line: false };
        });
      }
      if (t === 'tally') {
        const nk = d.nameKey || this.__inferXKey();
        return this.__rows().map((r, i) => {
          const key = String((r || {})[nk] ?? i);
          return { key, name: this.__labelOf(key, key), slot: this.__slotOf(key, i), pattern: 'solid', marker: 'circle', line: false };
        });
      }
      if (t === 'heat') return [];
      if (t === 'sparkline') {
        return [{ key: 'value', name: d.label || 'Trend', slot: d.palette != null ? d.palette : 0, pattern: 'solid', marker: 'circle', line: d.sparkVariant !== 'bar' }];
      }
      // xy family: look comes from seriesLook over ALL inputs (upstream useLegend)
      const inputs = this.__inputs || [];
      return inputs.map((s) => {
        const look = seriesLook(s.kind, s.slot, inputs.length, d.patterns, s);
        return { key: s.key, name: s.name, slot: s.slot, pattern: look.pattern, marker: look.marker, line: s.kind === 'line' };
      });
    },
    // ---------- render ----------
    __rebuild() {
      const d = this.data;
      this.__hidden = new Set(d.hiddenSeries && d.hiddenSeries.length ? d.hiddenSeries : d.defaultHiddenSeries || []);
      this.__xk = null;
      this.__activeIdx = null;
      const spec = this.__buildSpec();
      this.__spec = spec;
      this.__L = null;
      // center overlay (gauge always; pie/donut/radial when asked)
      let center = null;
      if (spec.type === 'gauge') {
        center = { value: d.centerValue || formatNumber(spec.value), label: d.centerLabel || '', place: 'gauge' };
      } else if ((spec.type === 'pie' || spec.type === 'radial') && (d.centerValue || d.centerLabel)) {
        center = { value: d.centerValue, label: d.centerLabel, place: 'mid' };
      }
      this.__center = center;
      this.setData({
        legendRows: this.__legendRows(),
        cursorBehind: [],
        cursorAbove: [],
        tip: null,
        center: null,
        summary: this.__summary(spec),
      });
      setTimeout(() => this.__paint(), 0);
    },
    __paint() {
      if (this.__dead) return;
      const spec = this.__spec;
      if (!spec) return;
      this.createSelectorQuery()
        .select('.ll-chart__stage')
        .boundingClientRect((rect) => {
          if (!rect || !rect.width || !rect.height) return;
          const seed = `${hashSeed(`chart:${this.data.type}:${this.data.seed || ''}`)}`;
          const entry = renderLayers(this.__recipeId(), bucketBox(rect.width, rect.height), spec, seed);
          if (!entry || !entry.uris.rest) return;
          const L = layoutChart(spec, { w: rect.width, h: rect.height }, false);
          this.__L = L;
          const at = (v, tot) => `${((v / tot) * 100).toFixed(2)}%`;
          const labels = (L.labels || []).map((l, i) => {
            const ax = l.anchor === 'start' ? '0%' : l.anchor === 'end' ? '-100%' : '-50%';
            const vy = l.valign === 'top' ? '0%' : l.valign === 'bottom' ? '-100%' : '-50%';
            return {
              id: l.id || `l${i}`,
              text: l.text,
              role: l.role,
              tone: l.tone || 'ink',
              style: `left:${at(l.x, rect.width)};top:${at(l.y, rect.height)};font-size:${l.size || 11}px;transform:translate(${ax},${vy});`,
            };
          });
          let center = null;
          const c = this.__center;
          if (c && L.cx != null) {
            const y = c.place === 'gauge' ? L.cy + (spec.sweep <= 180 ? 26 : 14) : L.cy;
            center = { value: c.value, label: c.label, style: `left:${at(L.cx, rect.width)};top:${at(y, rect.height)};` };
          }
          this.setData({ stageStyle: `inset:${-entry.pad}px;background-image:url("${entry.uris.rest}");`, labels, center });
        })
        .exec();
    },
    __recipeId() {
      const t = this.data.type;
      if (t === 'pie' || t === 'donut') return 'chart-pie';
      if (t === 'radar') return 'chart-radar';
      if (t === 'radial') return 'chart-radial';
      if (t === 'gauge') return 'chart-gauge';
      if (t === 'sparkline') return 'chart-spark';
      if (t === 'tally') return 'chart-tally';
      if (t === 'heat') return 'chart-heat';
      return 'chart-xy';
    },
    // ---------- taps: cursor + tooltip ----------
    onStageTap(e) {
      const L = this.__L;
      const spec = this.__spec;
      if (!L || !spec || spec.state !== 'ready') return;
      if (!L.targets || L.targets.n <= 0) return;
      const t = e.changedTouches && e.changedTouches[0];
      if (!t) return;
      this.createSelectorQuery()
        .select('.ll-chart__stage')
        .boundingClientRect((rect) => {
          if (!rect || !rect.width || !rect.height) return;
          const x = (t.clientX - rect.left) * (L.w / rect.width);
          const y = (t.clientY - rect.top) * (L.h / rect.height);
          const idx = hitIndex(L.targets, x, y);
          if (idx == null || idx === this.__activeIdx) {
            this.__clearActive();
            return;
          }
          this.__activate(idx);
        })
        .exec();
    },
    __activate(idx) {
      const d = this.data;
      const L = this.__L;
      if (!L) return;
      this.__activeIdx = idx;
      this.triggerEvent('activate', { index: idx, series: null });
      this.triggerEvent('select', { index: idx, series: null });
      const seed = `${hashSeed(`chart:${d.type}:${d.seed || ''}`)}`;
      const specs = L.cursorAt(idx, null) || [];
      const mk = (c) => {
        const entry = renderLayers('chart-mark', bucketBox(Math.max(4, Math.round(c.w)), Math.max(4, Math.round(c.h))), this.__cursorParams(c), `${seed}:${c.kind}`);
        if (!entry || !entry.uris.rest) return null;
        const pos = `left:${((c.x / L.w) * 100).toFixed(2)}%;top:${((c.y / L.h) * 100).toFixed(2)}%;width:${((c.w / L.w) * 100).toFixed(2)}%;height:${((c.h / L.h) * 100).toFixed(2)}%;`;
        const ink = `inset:${-entry.pad}px;background-image:url("${entry.uris.rest}");`;
        return { style: pos, ink };
      };
      const cursorBehind = [];
      const cursorAbove = [];
      for (const c of specs) {
        const mark = mk(c);
        if (!mark) continue;
        if (c.kind === 'column' || c.kind === 'guide') cursorBehind.push(mark);
        else cursorAbove.push(mark);
      }
      let tip = null;
      if (d.tooltip) {
        const model = this.__describe(idx);
        if (model) {
          const ax = L.targets.cx && L.targets.cx.length ? L.targets.cx[idx] : 0;
          const ay = L.targets.cy && L.targets.cy.length ? L.targets.cy[idx] : 0;
          const below = L.h > 0 && ay < L.h * 0.28;
          tip = {
            label: model.label,
            rows: model.rows,
            below,
            style: `left:${((ax / L.w) * 100).toFixed(2)}%;top:${((ay / L.h) * 100).toFixed(2)}%;`,
          };
        }
      }
      this.setData({ cursorBehind, cursorAbove, tip });
    },
    __clearActive() {
      if (this.__activeIdx == null && !this.data.tip) return;
      this.__activeIdx = null;
      this.triggerEvent('activate', { index: null, series: null });
      this.setData({ cursorBehind: [], cursorAbove: [], tip: null });
    },
    __cursorParams(c) {
      if (c.kind === 'ring') return { kind: 'ring', slot: c.slot };
      if (c.kind === 'slice') return { kind: 'slice', cx: c.cx, cy: c.cy, r0: c.r0, r1: c.r1, a0: c.a0, a1: c.a1 };
      if (c.kind === 'spoke') return { kind: 'spoke', x1: c.x1, y1: c.y1, x2: c.x2, y2: c.y2 };
      return { kind: c.kind };
    },
    /** Tooltip model — the upstream describe() per chart type. */
    __describe(idx) {
      const spec = this.__spec;
      const L = this.__L;
      const d = this.data;
      const fmt = formatNumber;
      if (!spec || !L) return null;
      const t = spec.type;
      if (t === 'xy') {
        if (spec.series.some((s) => s.kind === 'scatter')) {
          const p = (L.pointOf || [])[idx];
          if (!p) return null;
          const s = spec.series[p.s];
          const x = s.xs ? s.xs[p.j] : 0;
          return { label: `${d.xKey || this.__xk || 'x'} ${isNum(x) ? fmt(x) : '—'}`, rows: [{ name: s.name, value: isNum(s.values[p.j]) ? fmt(s.values[p.j]) : '—', dot: slotKey(s.slot) }] };
        }
        const rows = spec.series
          .filter((s) => isNum(s.values[idx]))
          .map((s) => ({ name: s.name, value: fmt(s.values[idx]), dot: slotKey(s.slot) }));
        return { label: spec.cats[idx] ?? '', rows };
      }
      if (t === 'pie') {
        const at = (L.sliceOf || [])[idx];
        const si = at == null ? idx : at;
        const sl = spec.slices[si];
        if (!sl) return null;
        const total = spec.slices.reduce((n, s) => n + s.value, 0);
        const share = total ? `${Math.round((sl.value / total) * 1000) / 10}%` : '0%';
        return { label: sl.name, rows: [{ name: sl.name, value: `${fmt(sl.value)} (${share})`, dot: slotKey(sl.slot) }] };
      }
      if (t === 'radar') {
        const rows = spec.series
          .filter((s) => isNum(s.values[idx]))
          .map((s) => ({ name: s.name, value: fmt(s.values[idx]), dot: slotKey(s.slot) }));
        return { label: spec.axes[idx] ?? '', rows };
      }
      if (t === 'radial') {
        const r = spec.rings[idx];
        if (!r) return null;
        return { label: r.name, rows: [{ name: r.name, value: `${fmt(r.value)} of ${fmt(r.max)}`, dot: slotKey(r.slot) }] };
      }
      if (t === 'spark') {
        const v = spec.values[idx];
        if (!isNum(v)) return null;
        const raw = this.__rows()[idx];
        const cat = d.xKey && raw && typeof raw === 'object' ? String(raw[d.xKey] ?? idx + 1) : `Point ${idx + 1}`;
        return { label: cat, rows: [{ name: d.label || 'Trend', value: fmt(v), dot: slotKey(spec.slot) }] };
      }
      if (t === 'tally') {
        const r = spec.rows[idx];
        if (!r) return null;
        return { label: r.name, rows: [{ name: r.name, value: fmt(r.count), dot: slotKey(r.slot) }] };
      }
      if (t === 'heat') {
        const cells = this.__heatCells;
        if (!cells) return null;
        const v = cells.values[idx];
        if ((cells.levels[idx] ?? -1) < 0 || !isNum(v)) return null;
        let cn;
        if (d.variant === 'grid') {
          cn = `${(cells.rowLabels[Math.floor(idx / cells.cols)] || {}).text ?? ''}, ${(cells.colLabels[idx % cells.cols] || {}).text ?? ''}`;
        } else {
          cn = fmtDay(cells.days[idx], true);
        }
        return { label: cn, rows: [{ name: d.heatUnit || 'Value', value: fmt(v), dot: slotKey(spec.slot) }] };
      }
      return null;
    },
    // ---------- legend toggles ----------
    onLegendTap(e) {
      const key = e.currentTarget.dataset.key;
      if (!key) return;
      const hidden = new Set(this.data.hiddenSeries || []);
      if (hidden.has(key)) hidden.delete(key);
      else hidden.add(key);
      const arr = Array.from(hidden);
      this.setData({ hiddenSeries: arr });
      this.triggerEvent('legendchange', { hidden: arr });
      this.__rebuild();
    },
  },
});
