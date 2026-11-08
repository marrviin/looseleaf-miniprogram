/** ll-chart props — upstream chart.tsx (Bar/Line/Area/Scatter/Pie/Donut/
    Radar/Radial/Gauge/Sparkline/Tally/Heatmap) folded into one component.
    Upstream's per-type React wrappers become `type`; the container's
    ChartConfig becomes `config`. Function props (formatters) have no
    counterpart and use the built-in compact/number formats. */
export const props = {
  /** bar | line | area | scatter | pie | donut | radar | radial | gauge |
      sparkline | tally | heat */
  type: {
    type: String,
    value: 'bar',
  },
  /** Rows (xy/tally/heat/pie/radial: one object per category) or plain
      numbers (sparkline). */
  data: {
    type: Array,
    value: [],
  },
  /** The category key. Default: the first key whose value is text. */
  xKey: {
    type: String,
    value: '',
  },
  /** Keys to draw, in stacking order. Default: the numeric keys of the
      data (or of `config`). */
  series: {
    type: Array,
    value: [],
  },
  /** { key: { label } } — names and draw order for the series/slices. */
  config: {
    type: null,
    optionalTypes: [Object],
    value: null,
  },
  /** Scatter bubble size key: points grow into bubbles by this value. */
  sizeKey: {
    type: String,
    value: '',
  },
  /** Mix marks on an xy chart: { revenue: 'bar', target: 'line' }. */
  kinds: {
    type: null,
    optionalTypes: [Object],
    value: null,
  },
  /** Stack bars (or areas). */
  stacked: {
    type: Boolean,
    value: false,
  },
  /** Horizontal bars. */
  horizontal: {
    type: Boolean,
    value: false,
  },
  /** How lines/areas join their points: smooth | linear | step. */
  curve: {
    type: String,
    value: 'smooth',
  },
  /** Pin the value axis [min, max] ('auto' picks a tidy end). */
  domain: {
    type: Array,
    value: null,
  },
  /** Whether the value axis includes zero (default: yes for bars/areas). */
  zero: {
    type: null,
    optionalTypes: [Boolean],
    value: null,
  },
  /** Point markers on lines: drawn when few and roomy ('auto' | bool). */
  dots: {
    type: null,
    optionalTypes: [Boolean, String],
    value: 'auto',
  },
  /** Numbers on top of bars when they fit ('auto' | bool). */
  showValues: {
    type: null,
    optionalTypes: [Boolean, String],
    value: 'auto',
  },
  showGrid: {
    type: Boolean,
    value: true,
  },
  showXAxis: {
    type: Boolean,
    value: true,
  },
  showYAxis: {
    type: Boolean,
    value: true,
  },
  /** Hand-circled call-outs: { at, series?, text, pen?, shape?, dx?, dy? }. */
  annotations: {
    type: Array,
    value: [],
  },
  /** Dashed goal lines: { y, label?, pen? }. */
  references: {
    type: Array,
    value: [],
  },
  /** Highlighter bands: { from, to, text? } (labels or indices). */
  highlights: {
    type: Array,
    value: [],
  },
  /** Pencil patterns on filled marks / dashed lines: 'auto' (on with more
      than one series) | true | false. */
  patterns: {
    type: null,
    optionalTypes: [Boolean, String],
    value: 'auto',
  },
  // ---------- pie / donut ----------
  nameKey: {
    type: String,
    value: '',
  },
  valueKey: {
    type: String,
    value: '',
  },
  /** Donut hole (0–0.9); type 'donut' is 0.58. */
  innerRadius: {
    type: null,
    optionalTypes: [Number],
    value: null,
  },
  startAngle: {
    type: null,
    optionalTypes: [Number],
    value: 0,
  },
  showLabels: {
    type: Boolean,
    value: true,
  },
  centerValue: {
    type: String,
    value: '',
  },
  centerLabel: {
    type: String,
    value: '',
  },
  // ---------- radar ----------
  /** Pin the rim; default: a tidy value above the largest spoke. */
  max: {
    type: null,
    optionalTypes: [Number],
    value: null,
  },
  levels: {
    type: null,
    optionalTypes: [Number],
    value: 4,
  },
  fill: {
    type: Boolean,
    value: true,
  },
  // ---------- radial ----------
  endAngle: {
    type: null,
    optionalTypes: [Number],
    value: 270,
  },
  // ---------- gauge ----------
  value: {
    type: null,
    optionalTypes: [Number],
    value: 0,
  },
  min: {
    type: null,
    optionalTypes: [Number],
    value: 0,
  },
  /** Gauge zones: { to, tone?: 'good'|'warn'|'bad'|'info'|'brand'|number }. */
  zones: {
    type: Array,
    value: [],
  },
  sweep: {
    type: null,
    optionalTypes: [Number],
    value: 180,
  },
  gaugeTicks: {
    type: null,
    optionalTypes: [Number],
    value: 10,
  },
  // ---------- sparkline ----------
  /** line | area | bar. */
  sparkVariant: {
    type: String,
    value: 'line',
  },
  /** Which key of object rows to read (default 'value'). */
  dataKey: {
    type: String,
    value: '',
  },
  ends: {
    type: Boolean,
    value: true,
  },
  extremes: {
    type: Boolean,
    value: false,
  },
  /** Palette slot (sparkline / heat). (upstream `slot`; the attribute name
      is reserved in WXML, so it lands here as `palette`) */
  palette: {
    type: null,
    optionalTypes: [Number],
    value: null,
  },
  // ---------- tally ----------
  /** Marks per bundle (0 = auto). */
  unit: {
    type: null,
    optionalTypes: [Number],
    value: 0,
  },
  // ---------- heat ----------
  /** calendar | grid. */
  variant: {
    type: String,
    value: 'calendar',
  },
  dateKey: {
    type: String,
    value: 'date',
  },
  heatValueKey: {
    type: String,
    value: 'value',
  },
  weeks: {
    type: null,
    optionalTypes: [Number],
    value: null,
  },
  /** Last day of a calendar heat map, 'YYYY-MM-DD'. */
  end: {
    type: String,
    value: '',
  },
  weekStart: {
    type: null,
    optionalTypes: [Number],
    value: 0,
  },
  rowKey: {
    type: String,
    value: 'row',
  },
  colKey: {
    type: String,
    value: 'col',
  },
  /** Grid heat map row/col labels, in order. */
  rowLabels: {
    type: Array,
    value: [],
  },
  colLabels: {
    type: Array,
    value: [],
  },
  heatLevels: {
    type: null,
    optionalTypes: [Number],
    value: 5,
  },
  thresholds: {
    type: Array,
    value: [],
  },
  heatUnit: {
    type: String,
    value: '',
  },
  showLegend: {
    type: Boolean,
    value: true,
  },
  // ---------- container ----------
  /** Legend buttons (default: shown when more than one series). */
  legend: {
    type: null,
    optionalTypes: [Boolean],
    value: null,
  },
  /** Series switched off (controlled; `legendchange` on toggle). */
  hiddenSeries: {
    type: Array,
    value: [],
  },
  defaultHiddenSeries: {
    type: Array,
    value: [],
  },
  /** Tap a data point: cursor mark + tooltip slip + `select`. */
  tooltip: {
    type: Boolean,
    value: true,
  },
  /** The chart's accessible name. */
  label: {
    type: String,
    value: '',
  },
  description: {
    type: String,
    value: '',
  },
  loading: {
    type: Boolean,
    value: false,
  },
  emptyText: {
    type: String,
    value: '',
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  ariaLabel: {
    type: String,
    value: '',
  },
};
