// ll-switch demo — mirrors the upstream docs page (#/components/switch).
// Labels are plain text; tapping one toggles its switch through the page
// state (WeChat has no htmlFor association for view-based switches).
function makeCells() {
  const cols = ['off', 'on', 'invalid', 'invalid on', 'disabled', 'disabled on'];
  return cols.map((label, ci) => ({
    ci,
    label,
    checked: ci % 2 === 1,
    invalid: ci === 2 || ci === 3,
    disabled: ci >= 4,
  }));
}

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    airplane: false,
    rows: ['default', 'sm'],
    cols: ['off', 'on', 'invalid', 'invalid on', 'disabled', 'disabled on'],
    // states grid: cells carry their own state (unique keys for wx:for)
    grid: [
      { name: 'default', sm: false, cells: makeCells() },
      { name: 'sm', sm: true, cells: makeCells() },
    ],
    settings: [
      { id: 'ruled', title: 'Show ruled lines', help: 'Blue pencil rules behind everything you write.', on: true, locked: false },
      { id: 'hints', title: 'Highlighter hints', help: 'Underline what changed since you last looked.', on: true, locked: false },
      { id: 'sound', title: 'Pencil scratch sound', help: 'A soft scratch while you type. Off is quieter.', on: false, locked: false },
      { id: 'sync', title: 'Sync to the cloud', help: 'Locked by your administrator.', on: true, locked: true },
    ],
    digest: true,
    marketing: false,
    sent: '',
    demo: false,
  },
  methods: {
    toggleAirplane() {
      this.setData({ airplane: !this.data.airplane });
    },
    onAirplaneChange(e) {
      this.setData({ airplane: e.detail.value });
    },
    onSettingsChange(e) {
      const id = e.currentTarget.dataset.id;
      this.setData({ settings: this.data.settings.map((s) => (s.id === id ? { ...s, on: e.detail.value } : s)) });
    },
    onDigestChange(e) {
      this.setData({ digest: e.detail.value });
    },
    onMarketingChange(e) {
      this.setData({ marketing: e.detail.value });
    },
    save() {
      this.setData({ sent: `Saved: digest ${this.data.digest ? 'weekly' : 'off'}, marketing ${this.data.marketing ? 'on' : 'off'}` });
    },
    toggleDemo() {
      this.setData({ demo: !this.data.demo });
    },
    onDemoChange(e) {
      this.setData({ demo: e.detail.value });
    },
  },
});
