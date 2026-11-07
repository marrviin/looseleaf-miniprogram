// ll-stepper demo — mirrors the upstream docs page (#/components/stepper).
// Labels are plain text; wheel (a mouse interaction) has no miniprogram
// equivalent; format/parse become prefix/suffix + precision.
const LINES = [
  { id: 'pencils', name: 'Beeswax pencils', price: 4.5, qty: 7 },
  { id: 'tape', name: 'Washi tape', price: 3, qty: 2 },
  { id: 'paper', name: 'Graph paper pad', price: 6.25, qty: 1 },
];

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01-quantity
    qty: 2,
    // 02-steps-and-format
    price: 4.5,
    temp: 20,
    grams: 250,
    // 03-cart-lines
    lines: LINES.map((l) => ({ ...l })),
    total: '$' + LINES.reduce((s, l) => s + l.qty * l.price, 0).toFixed(2),
    // 04-in-a-form
    adults: 2,
    kids: 0,
    sent: null,
  },
  methods: {
    onQty(e) {
      this.setData({ qty: e.detail.value });
    },
    onPrice(e) {
      this.setData({ price: e.detail.value });
    },
    onTemp(e) {
      this.setData({ temp: e.detail.value });
    },
    onGrams(e) {
      this.setData({ grams: e.detail.value });
    },
    onLineQty(e) {
      const id = e.currentTarget.dataset.id;
      const lines = this.data.lines.map((l) => (l.id === id ? { ...l, qty: e.detail.value } : l));
      const total = '$' + lines.reduce((s, l) => s + (l.qty ?? 0) * l.price, 0).toFixed(2);
      this.setData({ lines, total });
    },
    onAdults(e) {
      this.setData({ adults: e.detail.value });
    },
    onKids(e) {
      this.setData({ kids: e.detail.value });
    },
    onBook() {
      this.setData({ sent: `${this.data.adults} adults, ${this.data.kids} kids` });
    },
    onFormReset() {
      this.setData({ sent: null });
    },
  },
});
