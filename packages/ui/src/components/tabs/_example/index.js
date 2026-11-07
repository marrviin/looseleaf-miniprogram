Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    tab: 'account', // Demo / Account and password (uncontrolled)
    day: 'Tue', // Controlled, manual activation
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
  methods: {
    onTabChange(e) {
      this.setData({ tab: e.detail.value });
    },
    onDayChange(e) {
      this.setData({ day: e.detail.value });
    },
    goDay(e) {
      const dir = Number(e.currentTarget.dataset.dir);
      const { days, day } = this.data;
      const at = days.indexOf(day);
      this.setData({ day: days[Math.min(days.length - 1, Math.max(0, at + dir))] });
    },
  },
});
