Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01 bar
    sales: [
      { day: 'Mon', sales: 12 },
      { day: 'Tue', sales: 19 },
      { day: 'Wed', sales: 8 },
      { day: 'Thu', sales: 24 },
      { day: 'Fri', sales: 16 },
      { day: 'Sat', sales: 21 },
      { day: 'Sun', sales: 14 },
    ],
    barSaid: 'Tap the bars: a highlighter lights the column.',
    // 02 grouped / stacked / sideways
    quarters: [
      { quarter: 'Q1', income: 120, costs: -60, tax: -12 },
      { quarter: 'Q2', income: 150, costs: -90, tax: -18 },
      { quarter: 'Q3', income: 90, costs: -40, tax: -9 },
      { quarter: 'Q4', income: 180, costs: -110, tax: -22 },
    ],
    mode: 'grouped',
    cfgDevices: { desktop: { label: 'Desktop' }, mobile: { label: 'Mobile' }, tablet: { label: 'Tablet' } },
    cfgSources: { direct: { label: 'Direct' }, search: { label: 'Search' }, social: { label: 'Social' } },
    cfgSkills: { ada: { label: 'Ada' }, bo: { label: 'Bo' } },
    // 03 line / 04 area
    visitors: [
      { month: 'Jan', desktop: 186, mobile: 80, tablet: 40 },
      { month: 'Feb', desktop: 305, mobile: 200, tablet: 66 },
      { month: 'Mar', desktop: 237, mobile: 120, tablet: 90 },
      { month: 'Apr', desktop: 73, mobile: 190, tablet: 84 },
      { month: 'May', desktop: 209, mobile: 130, tablet: 72 },
      { month: 'Jun', desktop: 214, mobile: 140, tablet: 110 },
    ],
    traffic: [
      { month: 'Jan', direct: 186, search: 80, social: 40 },
      { month: 'Feb', direct: 305, search: 200, social: 66 },
      { month: 'Mar', direct: 237, search: 120, social: 90 },
      { month: 'Apr', direct: 73, search: 190, social: 84 },
      { month: 'May', direct: 209, search: 130, social: 72 },
      { month: 'Jun', direct: 214, search: 140, social: 110 },
    ],
    // 05 pie and donut
    browsers: [
      { browser: 'chrome', visitors: 275 },
      { browser: 'safari', visitors: 200 },
      { browser: 'firefox', visitors: 187 },
      { browser: 'edge', visitors: 173 },
      { browser: 'other', visitors: 90 },
    ],
    pieSaid: 'Tap a slice: a slip of paper names it.',
    // 06 radar
    skills: [
      { skill: 'Speed', ada: 80, bo: 50 },
      { skill: 'Power', ada: 60, bo: 85 },
      { skill: 'Range', ada: 90, bo: 45 },
      { skill: 'Craft', ada: 70, bo: 80 },
      { skill: 'Wit', ada: 55, bo: 90 },
      { skill: 'Luck', ada: 65, bo: 40 },
    ],
    // 07 radial and gauge
    rings: [
      { name: 'move', value: 78 },
      { name: 'exercise', value: 52 },
      { name: 'stand', value: 91 },
    ],
    // 08 sparklines
    tiles: [
      { title: 'Visitors', value: '12,840', note: 'up 12% on last week', up: true, data: [4, 6, 5, 8, 7, 11, 9, 12, 10, 15, 13, 17], variant: 'line' },
      { title: 'Revenue', value: '$4,320', note: 'steady', up: true, data: [8, 7, 9, 8, 10, 9, 11, 10, 12, 11, 12, 13], variant: 'area' },
      { title: 'Signups', value: '318', note: 'down 3 since Monday', up: false, data: [9, 12, 8, 10, 7, 9, 6, 8, 5, 7, 6, 4], variant: 'bar' },
    ],
    // 09 heat maps
    pages: [],
    busy: (() => {
      const hours = ['9am', '11am', '1pm', '3pm', '5pm'];
      const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      return week.flatMap((day, r) => hours.map((h, c) => ({ day, hour: h, orders: ((r + 1) * (c + 2) * 3) % 17 })));
    })(),
    heatCols: ['9am', '11am', '1pm', '3pm', '5pm'],
    heatRows: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    // 11 scatter
    cloud: Array.from({ length: 36 }, (_, i) => {
      const x = 20 + i * 2.2 + ((i * 13) % 7);
      return { height: Math.round(x), cats: Math.round(30 + i * 1.1 + ((i * 29) % 19)), dogs: Math.round(24 + i * 0.7 + ((i * 17) % 23)), age: 2 + ((i * 5) % 14) };
    }),
    // 12 annotations
    which: 'best day',
    highlights: {
      'best day': [],
      'rainy day': [{ from: 'Tue', to: 'Wed', text: 'storm' }],
      'both ends': [{ from: 'Fri', to: 'Sun', text: 'weekend' }],
    },
    notes: {
      'best day': [{ at: 'max', text: 'best day!', pen: 'blue' }],
      'rainy day': [{ at: 'Wed', text: 'rainy day', pen: 'ink', shape: 'underline', dx: 44, dy: -56 }],
      'both ends': [
        { at: 'first', text: 'slow start', pen: 'red', shape: 'loop' },
        { at: 'last', text: 'still going', pen: 'green', shape: 'loop' },
      ],
    },
    // 13 legend and hidden series
    hidden: ['tablet'],
    // 16 empty and loading
    state: 'ready',
    // 18 patterns
    patterns: true,
  },
  lifetimes: {
    attached() {
      // half a year of days, like the upstream heat map example
      const pages = Array.from({ length: 180 }, (_, i) => {
        const d = new Date(Date.UTC(2026, 0, 1 + i));
        const wave = Math.sin(i / 9) + Math.sin(i / 3.3) + ((i * 7) % 5) / 2;
        return { date: d.toISOString().slice(0, 10), value: wave > 0.6 ? Math.round(wave * 2) : 0 };
      });
      this.setData({ pages });
    },
  },
  methods: {
    onBarActivate(e) {
      const i = e.detail.index;
      this.setData({ barSaid: i == null ? 'No column picked.' : `${this.data.sales[i].day}: ${this.data.sales[i].sales} units sold.` });
    },
    setMode(e) {
      this.setData({ mode: e.currentTarget.dataset.mode });
    },
    onPieActivate(e) {
      const i = e.detail.index;
      this.setData({ pieSaid: i == null ? 'No slice picked.' : `${this.data.browsers[i].browser}: ${this.data.browsers[i].visitors} visitors.` });
    },
    setWhich(e) {
      this.setData({ which: e.currentTarget.dataset.which });
    },
    setHidden(e) {
      this.setData({ hidden: e.currentTarget.dataset.hidden });
    },
    onHiddenChange(e) {
      this.setData({ hidden: e.detail.hidden || [] });
    },
    setState(e) {
      this.setData({ state: e.currentTarget.dataset.state });
    },
    togglePatterns() {
      this.setData({ patterns: !this.data.patterns });
    },
  },
});
