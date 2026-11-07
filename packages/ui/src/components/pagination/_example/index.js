const LAST = 9; // example 2: nine pages with classic windowing

function windowed(page) {
  const out = [];
  for (let p = 1; p <= LAST; p++) {
    if (p === 1 || p === LAST || Math.abs(p - page) <= 1) out.push({ kind: 'page', p });
    else if (p < page && out[out.length - 1].kind !== 'gap-l') out.push({ kind: 'gap-l' });
    else if (p > page && out[out.length - 1].kind !== 'gap-r') out.push({ kind: 'gap-r' });
  }
  return out;
}

/** Example 4 (table footer, composed): twenty-three notebooks, five to a page. */
const ROW_NAMES = ['Field notes', 'Garden log', 'Recipes', 'Trip to Lisbon', 'Sketches', 'Reading list', 'Letters', 'Budget'];
const ROWS = Array.from({ length: 23 }, (_, i) => ({
  name: ROW_NAMES[i % 8] + (i >= 8 ? ` ${Math.floor(i / 8) + 1}` : ''),
  pages: 12 + ((i * 37) % 90),
}));
const T_SIZE = 5;
const T_PAGES = Math.ceil(ROWS.length / T_SIZE);

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // Example 2 — controlled with gaps
    page: 5,
    last: LAST,
    items: windowed(5),
    // Example 3 — simple pager
    simplePage: 3,
    simpleTotal: 12,
    // Example 4 — table footer
    tPage: 1,
    tPages: T_PAGES,
    tTotal: ROWS.length,
    tRows: [],
    tFrom: 0,
    tShown: 0,
  },
  lifetimes: {
    attached() {
      this.__applyTable();
    },
  },
  methods: {
    go(e) {
      const n = Number(e.currentTarget.dataset.page);
      this.setData({ page: Math.min(LAST, Math.max(1, n)), items: windowed(Math.min(LAST, Math.max(1, n))) });
    },
    goPrev() {
      this.go({ currentTarget: { dataset: { page: this.data.page - 1 } } });
    },
    goNext() {
      this.go({ currentTarget: { dataset: { page: this.data.page + 1 } } });
    },
    goSimple(e) {
      const n = Number(e.currentTarget.dataset.page);
      this.setData({ simplePage: Math.min(this.data.simpleTotal, Math.max(1, n)) });
    },
    goSimplePrev() {
      this.goSimple({ currentTarget: { dataset: { page: this.data.simplePage - 1 } } });
    },
    goSimpleNext() {
      this.goSimple({ currentTarget: { dataset: { page: this.data.simplePage + 1 } } });
    },
    goTable(e) {
      const n = Number(e.currentTarget.dataset.page);
      this.setData({ tPage: Math.min(T_PAGES, Math.max(1, n)) });
      this.__applyTable();
    },
    goTablePrev() {
      this.goTable({ currentTarget: { dataset: { page: this.data.tPage - 1 } } });
    },
    goTableNext() {
      this.goTable({ currentTarget: { dataset: { page: this.data.tPage + 1 } } });
    },
    __applyTable() {
      const from = (this.data.tPage - 1) * T_SIZE;
      const rows = ROWS.slice(from, from + T_SIZE);
      this.setData({ tRows: rows, tFrom: from + 1, tShown: rows.length });
    },
  },
});
