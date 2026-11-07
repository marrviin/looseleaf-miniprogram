// ll-card demo — mirrors the upstream docs page (#/components/card).
// Guest book (needs the check stock), Article card / On every stock /
// Pinned, clipped, stapled land with the P3 paper work; Create project's
// Select lands with the select port (the field is a placeholder there).
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01-settings rows
    settings: [
      { id: 'comments', label: 'Comments on your notes', on: true },
      { id: 'replies', label: 'Replies to your questions', on: true },
      { id: 'weekly', label: 'The weekly summary, Fridays', on: false },
    ],
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
