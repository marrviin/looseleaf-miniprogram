Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01-typed-date
    due: '2026-09-17',
    dueSaid: 'Thu Sep 17 2026.',
    // 02-presets
    remind: '',
    // 03-date-range
    stay: ['2026-09-09', '2026-09-24'],
    staySaid: 'Sep 9, 2026 to Sep 24, 2026.',
    stayPresets: [
      { label: 'Last 7 days', value: { from: '2026-09-10', to: '2026-09-15' } },
      { label: 'This month', value: { from: '2026-09-01', to: '2026-09-30' } },
      { label: 'Next 14 days', value: { from: '2026-09-15', to: '2026-09-28' } },
    ],
    // 04-button-field
    born: '',
    // 05-reserve-a-table
    res: '',
    time: '19:00',
    times: ['18:00', '19:00', '20:00', '21:00'],
    sent: '',
  },
  methods: {
    onDue(e) {
      const v = e.detail.value;
      this.setData({ due: v, dueSaid: v ? this.__long(v) : 'No date yet.' });
    },
    onRemind(e) {
      this.setData({ remind: e.detail.value });
    },
    onStay(e) {
      const { from, to } = e.detail;
      this.setData({
        stay: e.detail.value,
        staySaid: to ? `${this.__med(from)} to ${this.__med(to)}.` : from ? `${this.__med(from)} — pick a last day.` : 'Pick a first day.',
      });
    },
    onBorn(e) {
      this.setData({ born: e.detail.value });
    },
    onRes(e) {
      this.setData({ res: e.detail.value });
    },
    onTime(e) {
      this.setData({ time: e.detail.value });
    },
    onReserve() {
      this.setData({ sent: `Sent: ${this.data.res || 'no date'} at ${this.data.time || 'no time'}.` });
    },
    __long(iso) {
      // Date's own toDateString, like the upstream demo line
      const t = new Date(iso + 'T00:00:00');
      return t.toDateString() + '.';
    },
    __med(iso) {
      const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const [y, m, d] = iso.split('-');
      return `${M[+m - 1]} ${+d}, ${y}`;
    },
  },
});
