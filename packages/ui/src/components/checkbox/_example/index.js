// ll-checkbox demo — mirrors the upstream docs page (#/components/checkbox).
// Labels are plain text; tapping one toggles its box through the page state
// (WeChat has no htmlFor association for view-based checkboxes).
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    terms: false,
    sizes: [
      { px: 16, name: '16 px' },
      { px: 20, name: '20 px' },
      { px: 28, name: '28 px' },
    ],
    items: [
      { name: 'Pencils', on: true },
      { name: 'Highlighters', on: false },
      { name: 'Washi tape', on: false },
      { name: 'Index cards', on: false },
    ],
    allOn: false,
    allIndeterminate: true,
    notify: [
      { name: 'comments', on: true },
      { name: 'replies', on: true },
      { name: 'mentions', on: false },
    ],
    agree: false,
    sent: '',
    // 50-with-description — checkbox first, then the label/help column;
    // the locked row dims through the FieldLabel's disabled prop
    descTerms: true,
    descPolicy: false,
    // 51-choice-cards — FieldLabel wrapped around a whole Field makes the
    // row one big target (checked card = highlighter wash + felt outline)
    cardNotify: true,
    cardDigest: false,
  },
  methods: {
    toggleTerms() {
      this.setData({ terms: !this.data.terms });
    },
    onTermsChange(e) {
      this.setData({ terms: e.detail.value });
    },
    syncAll(items) {
      const on = items.filter((i) => i.on).length;
      this.setData({
        items,
        allOn: on === items.length,
        allIndeterminate: on > 0 && on < items.length,
      });
    },
    onAllChange(e) {
      const on = !!e.detail.value;
      this.syncAll(this.data.items.map((i) => ({ ...i, on })));
    },
    onItemChange(e) {
      const name = e.currentTarget.dataset.name;
      this.syncAll(this.data.items.map((i) => (i.name === name ? { ...i, on: !!e.detail.value } : i)));
    },
    onNotifyChange(e) {
      const name = e.currentTarget.dataset.name;
      this.setData({ notify: this.data.notify.map((i) => (i.name === name ? { ...i, on: !!e.detail.value } : i)) });
    },
    onAgreeChange(e) {
      this.setData({ agree: e.detail.value, sent: '' });
    },
    onDescChange(e) {
      this.setData({ [e.currentTarget.dataset.key]: !!e.detail.value });
    },
    onCardNotify() {
      this.setData({ cardNotify: !this.data.cardNotify });
    },
    onCardDigest() {
      this.setData({ cardDigest: !this.data.cardDigest });
    },
    save() {
      if (!this.data.agree) {
        this.setData({ sent: 'The small print wants a tick first.' });
        return;
      }
      const on = this.data.notify.filter((i) => i.on).map((i) => i.name);
      this.setData({ sent: `Saved: ${on.join(', ') || 'nothing'}` });
    },
  },
});
