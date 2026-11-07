Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // "An order summary" — the menu, quantities, and the derived lines/total.
    menu: [
      { name: 'oat latte', price: 4.5 },
      { name: 'almond croissant', price: 3.1 },
      { name: 'washi tape', price: 3 },
    ],
    qty: [1, 2, 0],
    orderLines: [],
    orderTotal: '0.00',
    orderCircled: false,
  },
  lifetimes: {
    attached() {
      this.__syncOrder();
    },
  },
  methods: {
    __syncOrder() {
      const { menu, qty } = this.data;
      const lines = menu
        .map((m, i) => ({ name: m.name, qty: qty[i], price: (m.price * qty[i]).toFixed(2) }))
        .filter((l) => l.qty > 0);
      const total = menu.reduce((sum, m, i) => sum + m.price * qty[i], 0);
      this.setData({
        orderLines: lines,
        orderTotal: total.toFixed(2),
        orderCircled: total > 10,
      });
    },
    onLess(e) {
      const i = Number(e.currentTarget.dataset.idx);
      const qty = this.data.qty.map((v, j) => (j === i ? Math.max(0, v - 1) : v));
      this.setData({ qty });
      this.__syncOrder();
    },
    onMore(e) {
      const i = Number(e.currentTarget.dataset.idx);
      const qty = this.data.qty.map((v, j) => (j === i ? v + 1 : v));
      this.setData({ qty });
      this.__syncOrder();
    },
    /** Verification hook: drive a stepper by index/delta. */
    orderStep(idx, delta) {
      const i = Number(idx);
      const qty = this.data.qty.map((v, j) => (j === i ? Math.max(0, v + Number(delta)) : v));
      this.setData({ qty });
      this.__syncOrder();
      return { qty, total: this.data.orderTotal, circled: this.data.orderCircled };
    },
  },
});
