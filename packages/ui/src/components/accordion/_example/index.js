Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // Account settings (controlled): the open row lives in page state.
    open: 'profile',
    steps: ['profile', 'notifications', 'security'],
    settingsOpen: 'profile',
  },
  methods: {
    onSettingsChange(e) {
      this.setData({ settingsOpen: e.detail.value });
      this.setData({ open: e.detail.value });
    },
    nextStep() {
      const { steps, settingsOpen } = this.data;
      const at = Math.min(steps.indexOf(settingsOpen) + 1, steps.length - 1);
      this.setData({ settingsOpen: steps[at], open: steps[at] });
    },
  },
});
