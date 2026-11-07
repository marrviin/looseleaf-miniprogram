// ll-card demo — mirrors the upstream docs page (#/components/card).
// All card examples from the docs page are in; Create project's Select
// lands with the select port (the field is a placeholder there).
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01-settings rows
    settings: [
      { id: 'comments', label: 'Comments on your notes', on: true },
      { id: 'replies', label: 'Replies to your questions', on: true },
      { id: 'weekly', label: 'The weekly summary, Fridays', on: false },
    ],
    // 03-form guest book
    guestName: '',
    guestLine: '',
    guestStatus: '',
    // 04-article — torn bottom edge (per-side EdgeSpec)
    articleEdge: { bottom: 'torn' },
    // 05-stocks — stock / rules / edge per card (upstream `cards`)
    stocks: [
      { stock: 'graph', rules: 'graph', title: 'Graph', edge: 'cut' },
      { stock: 'dot-grid', rules: 'dots', title: 'Dot grid', edge: 'cut' },
      { stock: 'kraft', rules: 'none', title: 'Kraft', edge: 'cut' },
      { stock: 'index-card', rules: 'none', title: 'Torn index card', edge: { top: 'torn' } },
    ],
    // 06-fasteners
    fasteners: ['pin', 'clip', 'staple', 'binder-clip'],
    // 50-login
    loginEmail: '',
    loginPw: '',
    // 51-create-project (framework waits for ll-select)
    cpName: '',
    cpStatus: '',
  },
  methods: {
    onSettingChange(e) {
      const id = e.currentTarget.dataset.id;
      this.setData({ settings: this.data.settings.map((s) => (s.id === id ? { ...s, on: e.detail.value } : s)) });
    },
    onGuestName(e) {
      this.setData({ guestName: e.detail.value });
    },
    onGuestLine(e) {
      this.setData({ guestLine: e.detail.value });
    },
    onSign() {
      const name = this.data.guestName.trim();
      this.setData({ guestStatus: name ? `Signed, "${name}."` : 'The book is waiting for a name.' });
    },
    onLoginEmail(e) {
      this.setData({ loginEmail: e.detail.value });
    },
    onLoginPw(e) {
      this.setData({ loginPw: e.detail.value });
    },
    onCpName(e) {
      this.setData({ cpName: e.detail.value });
    },
    onDeploy() {
      this.setData({ cpStatus: `Deploying "${this.data.cpName || 'untitled'}" on no framework` });
    },
    onCancel() {
      this.setData({ cpStatus: 'Nothing deployed.' });
    },
  },
});
