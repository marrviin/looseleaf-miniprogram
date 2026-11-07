// ll-radio-group demo — mirrors the upstream docs page (#/components/radio-group).
// Labels are plain text; tapping one sets the group's value through the page
// state (WeChat has no htmlFor association for view-based radios).
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    density: 'comfortable',
    densityOptions: [
      { value: 'default', label: 'Default' },
      { value: 'comfortable', label: 'Comfortable' },
      { value: 'compact', label: 'Compact' },
    ],
    sizes: [
      { px: 16, name: '16 px' },
      { px: 20, name: '20 px' },
      { px: 28, name: '28 px' },
    ],
    plans: [
      { value: 'starter', title: 'Starter', help: 'One notebook, one pen, no rush.' },
      { value: 'studio', title: 'Studio', help: 'Ten notebooks and the good highlighters.' },
      { value: 'workshop', title: 'Workshop', help: 'A whole desk. Washi tape included.' },
    ],
    plan: 'studio',
    billing: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' },
    ],
    billingValue: 'yearly',
    inks: [
      { value: 'black', label: 'Black' },
      { value: 'blue', label: 'Blue' },
      { value: 'sepia', label: 'Sepia' },
    ],
    ink: '',
    sent: '',
    demoValue: 'comfortable',
    demoOptions: [
      { value: 'default', label: 'Default' },
      { value: 'comfortable', label: 'Comfortable' },
      { value: 'compact', label: 'Compact' },
    ],
  },
  methods: {
    onDensityChange(e) {
      this.setData({ density: e.detail.value });
    },
    pickDensity(e) {
      this.setData({ density: e.currentTarget.dataset.value });
    },
    onPlanChange(e) {
      this.setData({ plan: e.detail.value });
    },
    pickPlan(e) {
      this.setData({ plan: e.currentTarget.dataset.value });
    },
    onBillingChange(e) {
      this.setData({ billingValue: e.detail.value });
    },
    pickBilling(e) {
      this.setData({ billingValue: e.currentTarget.dataset.value });
    },
    onInkChange(e) {
      this.setData({ ink: e.detail.value, sent: '' });
    },
    pickInk(e) {
      this.setData({ ink: e.currentTarget.dataset.value, sent: '' });
    },
    vote() {
      if (!this.data.ink) {
        this.setData({ sent: 'The vote needs an ink picked first.' });
        return;
      }
      this.setData({ sent: `Ink of the month: ${this.data.ink}` });
    },
    onDemoChange(e) {
      this.setData({ demoValue: e.detail.value });
    },
    pickDemo(e) {
      this.setData({ demoValue: e.currentTarget.dataset.value });
    },
  },
});
