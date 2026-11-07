// ll-input demo — mirrors the upstream docs page (#/components/input).
// Upstream example 03-types: date needs <picker> and file needs
// wx.chooseMedia — both land with their own ports; the type section here
// carries password + number until then. Labels are plain text.
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    email: '',
    filled: 'ada@analytical.engine',
    broken: 'not-an-email',
    locked: "Can't touch this",
    printed: 'Order #2049',
    pw: 'hunter2hunter2',
    qty: '3',
    search: '',
    suName: '',
    suEmail: '',
    suTouched: false,
    suInvalid: false,
    suDone: false,
    suTerms: false,
    demoEmail: '',
    subEmail: '',
    labelEmail: '',
    helpEmail: '',
  },
  methods: {
    onEmailInput(e) {
      this.setData({ email: e.detail.value });
    },
    onQtyInput(e) {
      this.setData({ qty: e.detail.value });
    },
    onSearchInput(e) {
      this.setData({ search: e.detail.value });
    },
    onSuNameInput(e) {
      this.setData({ suName: e.detail.value });
    },
    onSuEmailInput(e) {
      const suEmail = e.detail.value;
      this.setData({
        suEmail,
        suInvalid: this.data.suTouched && !EMAIL_RE.test(suEmail),
        suDone: false,
      });
    },
    onSuEmailBlur() {
      this.setData({
        suTouched: true,
        suInvalid: !EMAIL_RE.test(this.data.suEmail),
      });
    },
    onSuTermsChange(e) {
      this.setData({ suTerms: e.detail.value });
    },
    signUp() {
      this.setData({ suTouched: true, suInvalid: !EMAIL_RE.test(this.data.suEmail) });
      if (!this.data.suInvalid && this.data.suEmail) this.setData({ suDone: true });
    },
    onDemoEmailInput(e) {
      this.setData({ demoEmail: e.detail.value });
    },
    onSubEmailInput(e) {
      this.setData({ subEmail: e.detail.value });
    },
    onLabelEmailInput(e) {
      this.setData({ labelEmail: e.detail.value });
    },
    onHelpEmailInput(e) {
      this.setData({ helpEmail: e.detail.value });
    },
  },
});
