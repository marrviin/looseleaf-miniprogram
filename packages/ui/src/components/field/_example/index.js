function checkEmail(email) {
  if (/^\S+@\S+\.\S+$/.test(email)) return [];
  return ['Enter an address like ada@notes.dev.'].map((message) => ({ message }));
}

function checkPass(pass) {
  const p = [];
  if (pass.length < 8) p.push('Use at least 8 characters.');
  if (!/\d/.test(pass)) p.push('Add a number.');
  return p.map((message) => ({ message }));
  return p;
}

const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => ({ value: m, label: m }));
const years = ['2026', '2027', '2028', '2029', '2030', '2031'].map((y) => ({ value: y, label: y }));
const departments = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'support', label: 'Customer Support' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
];

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    months,
    years,
    departments,
    // 02 orientations
    syncOn: true,
    termsOn: true,
    // 03 choice cards
    plan: 'studio',
    newsOn: true,
    // 04 errors
    email: 'ada',
    pass: 'pencil',
    errsShown: true,
    emailErrs: checkEmail('ada'),
    passErrs: checkPass('pencil'),
    // 50 payment
    payMonth: '',
    payYear: '',
    sameShipping: true,
    // 54 radio
    plan54: 'monthly',
    // 55 checkbox
    hardDisks: true,
    externalDisks: false,
    cdsDvds: false,
    connectedServers: false,
    syncFolders: true,
    // 56 switch
    twofaOn: false,
    // 57 slider
    price: [200, 800],
    // 58 select
    dept: '',
    // 59 choice card
    compute: 'kubernetes',
    // 60 group
    pushOn: true,
    pushTasks: false,
    emailTasks: false,
  },
  methods: {
    onSwitch(e) {
      const key = e.currentTarget.dataset.key;
      if (key) this.setData({ [key]: e.detail.value });
    },
    onCheck(e) {
      const key = e.currentTarget.dataset.key;
      if (key) this.setData({ [key]: !!e.detail.value });
    },
    onPick(e) {
      const key = e.currentTarget.dataset.key;
      if (key) this.setData({ [key]: e.detail.value });
    },
    onPlanCard(e) {
      this.setData({ plan: e.currentTarget.dataset.plan });
    },
    onNewsCard() {
      this.setData({ newsOn: !this.data.newsOn });
    },
    onComputeCard(e) {
      this.setData({ compute: e.currentTarget.dataset.value });
    },
    onEmail(e) {
      const email = e.detail.value;
      this.setData({ email, emailErrs: this.data.errsShown ? checkEmail(email) : [] });
    },
    onPass(e) {
      const pass = e.detail.value;
      this.setData({ pass, passErrs: this.data.errsShown ? checkPass(pass) : [] });
    },
    onSubmit() {
      this.setData({ errsShown: true, emailErrs: checkEmail(this.data.email), passErrs: checkPass(this.data.pass) });
    },
    onHideErrors() {
      this.setData({ errsShown: false, emailErrs: [], passErrs: [] });
    },
    onPrice(e) {
      this.setData({ price: e.detail.value });
    },
    noop() {},
  },
});
