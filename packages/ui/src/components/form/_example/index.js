Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01-default
    username: '',
    email: '',
    errors1: {},
    saved1: '',
    // 02-every-control
    roleOptions: [
      { label: 'Author', value: 'author' },
      { label: 'Editor', value: 'editor' },
    ],
    role: '',
    plan: '',
    pages: 20,
    digest: true,
    terms: false,
    errors2: {},
    saved2: '',
    // 03-server-errors
    handle: 'notes',
    errors3: {},
    pending: false,
    done3: '',
  },
  methods: {
    // 01 — zod rules played by hand; a change clears the field's message
    onForm1Field(e) {
      const key = e.currentTarget.dataset.key;
      if (!key || !(key in this.data.errors1)) {
        this.setData({ [key]: e.detail.value });
        return;
      }
      const errors1 = { ...this.data.errors1 };
      delete errors1[key];
      this.setData({ [key]: e.detail.value, errors1 });
    },
    onSave1() {
      const d = this.data;
      const errors1 = {};
      if (d.username.trim().length < 2) errors1.username = 'Your name needs at least 2 letters.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) errors1.email = 'Enter an address like ada@notes.dev.';
      this.setData({ errors1, saved1: '' });
      if (!Object.keys(errors1).length) this.setData({ saved1: `Saved ${d.username} <${d.email}>` });
    },
    // 02 — every control reports through the same generic handler
    onForm2Field(e) {
      const key = e.currentTarget.dataset.key;
      let v = e.detail.value;
      if (key === 'pages') v = Array.isArray(v) ? v[0] : v;
      const patch = { [key]: v };
      if (key in this.data.errors2) {
        const errors2 = { ...this.data.errors2 };
        delete errors2[key];
        patch.errors2 = errors2;
      }
      this.setData(patch);
    },
    onSave2() {
      const d = this.data;
      const errors2 = {};
      if (!d.role) errors2.role = 'Pick a role.';
      if (d.plan !== 'starter' && d.plan !== 'studio') errors2.plan = 'Choose a plan.';
      if (!(d.pages >= 5)) errors2.pages = 'Aim for at least 5 pages a day.';
      if (!d.terms) errors2.terms = 'You must accept the small print.';
      this.setData({ errors2, saved2: '' });
      if (!Object.keys(errors2).length) this.setData({ saved2: `Saved: ${d.role}, ${d.plan}, ${d.pages} pages` });
    },
    // 03 — schema check, then a pretend request that can reject the handle
    onForm3Field(e) {
      const key = e.currentTarget.dataset.key;
      const patch = { [key]: e.detail.value };
      if (key in this.data.errors3) {
        const errors3 = { ...this.data.errors3 };
        delete errors3[key];
        patch.errors3 = errors3;
      }
      this.setData(patch);
    },
    onClaim() {
      const d = this.data;
      if (d.pending) return;
      const errors3 = {};
      if (d.handle.length < 3) errors3.handle = 'At least 3 characters.';
      else if (!/^[a-z0-9_]+$/.test(d.handle)) errors3.handle = 'Lowercase letters, numbers and _ only.';
      if (Object.keys(errors3).length) {
        this.setData({ errors3, done3: '' });
        return;
      }
      this.setData({ pending: true, done3: '' });
      setTimeout(() => {
        if (['ada', 'grace', 'notes'].indexOf(d.handle) !== -1) {
          this.setData({ pending: false, errors3: { handle: `@${d.handle} is already taken.` } });
        } else {
          this.setData({ pending: false, done3: `@${d.handle} is yours.` });
        }
      }, 400);
    },
  },
});
