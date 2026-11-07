Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    sizes: ['Small', 'Loaf', 'Big'],
    orderSize: 'Loaf',
    orderSizeLower: 'loaf',
    qty: 2,
    pages: [1, 2, 3, 4, 5],
    page: 2,
    following: false,
    mailLabel: 'personal',
    mailOpen: false,
    mailSubOpen: false,
    followOpen: false,
    copilotOpen: false,
  },
  methods: {
    onSize(e) {
      const size = e.currentTarget.dataset.size;
      this.setData({ orderSize: size, orderSizeLower: size.toLowerCase() });
    },
    onQty(e) {
      const dir = Number(e.currentTarget.dataset.dir);
      this.setData({ qty: Math.min(6, Math.max(1, this.data.qty + dir)) });
    },
    onPage(e) {
      const p = e.currentTarget.dataset;
      if (p.page) {
        this.setData({ page: Number(p.page) });
      } else {
        this.setData({ page: Math.min(5, Math.max(1, this.data.page + Number(p.dir))) });
      }
    },
    onFollow() {
      this.setData({ following: !this.data.following });
    },
    onMenuChange(e) {
      const k = e.currentTarget.dataset.k;
      if (k) this.setData({ [k]: e.detail.open });
    },
    onMailLabel(e) {
      this.setData({ mailLabel: e.detail.value });
    },
  },
});
