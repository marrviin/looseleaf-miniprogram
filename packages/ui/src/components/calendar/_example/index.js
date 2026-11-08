Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01-planner-page
    cal1: '2026-09-17',
    cal1Said: 'Picked: 2026-09-17.',
    // 02-range-two-months
    cal2: ['2026-09-24', '2026-10-06'],
    cal2Said: '2026-09-24 to 2026-10-06.',
    // 03-dropdowns-and-limits
    cal3: '',
    cal3Footer: 'Pick a weekday from the 15th on.',
    // 04-book-a-call
    cal4: '2026-09-17',
    slots: ['09:00', '09:30', '10:30', '11:00', '13:30', '14:00', '15:30', '16:00'],
    slot: '10:30',
  },
  methods: {
    onCal1(e) {
      this.setData({
        cal1: e.detail.value,
        cal1Said: e.detail.value ? `Picked: ${e.detail.value}.` : 'Nothing picked.',
      });
    },
    onCal2(e) {
      const { from, to } = e.detail;
      this.setData({
        cal2: e.detail.value,
        cal2Said: to ? `${from} to ${to}.` : from ? `From ${from} — pick a last day.` : 'Pick a first day.',
      });
    },
    onCal3(e) {
      const v = e.detail.value;
      this.setData({
        cal3: v,
        cal3Footer: v ? `You picked ${v}.` : 'Pick a weekday from the 15th on.',
      });
    },
    onCal4(e) {
      this.setData({ cal4: e.detail.value, slot: '' });
    },
    onSlot(e) {
      this.setData({ slot: e.currentTarget.dataset.slot });
    },
  },
});
