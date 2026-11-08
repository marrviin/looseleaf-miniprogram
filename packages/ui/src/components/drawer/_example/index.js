// ll-drawer demo — mirrors the upstream docs page (#/components/drawer).
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01-move-goal
    dlgGoal: false,
    goal: 350,
    // bar heights precomputed in % of 400 (wxml can't do the math)
    bars: [400, 300, 200, 300, 200, 278, 189, 239, 300, 200, 278, 189, 349].map((v) => Math.round((v / 400) * 100)),
    // 02-snap-points
    dlgSnaps: false,
    snapLabel: 'Snapped at 35% of the screen.',
    todos: [
      'Buy oat milk', 'Water the ferns', 'Write to Ada', 'Return the library book',
      'Sharpen pencils', 'Fix the bike light', 'Bake the second loaf', 'Book the dentist',
      'Call mum', 'Plan the trip', 'Renew the passport', 'Order stamps',
    ],
    // 03-directions
    dlgBottom: false,
    dlgTop: false,
    dlgLeft: false,
    dlgRight: false,
    // 04-responsive-dialog (phone branch: the drawer)
    dlgRd: false,
  },
  methods: {
    openDlg(e) {
      this.setData({ [e.currentTarget.dataset.k]: true });
    },
    onDlgChange(e) {
      this.setData({ [e.currentTarget.dataset.k]: e.detail.value });
    },
    goalStep(e) {
      const d = Number(e.currentTarget.dataset.d) || 0;
      const g = Math.max(200, Math.min(400, this.data.goal + d));
      this.setData({ goal: g });
    },
    onSnapChange(e) {
      const pct = Math.round((e.detail.snap || 0) * 100);
      this.setData({ snapLabel: `Snapped at ${pct}% of the screen.` });
    },
  },
});
