const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// 01-invoices
const invoices01 = [
  { invoice: 'INV001', status: 'Paid', method: 'Credit card', amount: '$250.00' },
  { invoice: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
  { invoice: 'INV003', status: 'Unpaid', method: 'Bank transfer', amount: '$350.00' },
  { invoice: 'INV004', status: 'Paid', method: 'Credit card', amount: '$450.00' },
  { invoice: 'INV005', status: 'Paid', method: 'PayPal', amount: '$550.00' },
];

// 50-demo — the official table-demo's seven invoices
const invoices50 = [
  { invoice: 'INV001', paymentStatus: 'Paid', totalAmount: '$250.00', paymentMethod: 'Credit Card' },
  { invoice: 'INV002', paymentStatus: 'Pending', totalAmount: '$150.00', paymentMethod: 'PayPal' },
  { invoice: 'INV003', paymentStatus: 'Unpaid', totalAmount: '$350.00', paymentMethod: 'Bank Transfer' },
  { invoice: 'INV004', paymentStatus: 'Paid', totalAmount: '$450.00', paymentMethod: 'Credit Card' },
  { invoice: 'INV005', paymentStatus: 'Paid', totalAmount: '$550.00', paymentMethod: 'PayPal' },
  { invoice: 'INV006', paymentStatus: 'Pending', totalAmount: '$200.00', paymentMethod: 'Bank Transfer' },
  { invoice: 'INV007', paymentStatus: 'Unpaid', totalAmount: '$300.00', paymentMethod: 'Credit Card' },
];

// 03-sticky-header — 24 notebook pages
const pages = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  day: days[i % 5],
  page: 'Notebook, p. ' + (12 + i * 3),
  words: 180 + ((i * 97) % 640),
}));

// 02-data-table — 12 people, sort / select / paginate
const DATA02 = [
  { id: '1', name: 'Ada Lovelace', plan: 'Team', status: 'Paid', amount: 250 },
  { id: '2', name: 'Jo Okafor', plan: 'Solo', status: 'Pending', amount: 49 },
  { id: '3', name: 'Mika Kobayashi', plan: 'Team', status: 'Paid', amount: 250 },
  { id: '4', name: 'Sam Reyes', plan: 'Solo', status: 'Overdue', amount: 49 },
  { id: '5', name: 'Priya Nair', plan: 'Team', status: 'Paid', amount: 250 },
  { id: '6', name: 'Tomas Berg', plan: 'Solo', status: 'Paid', amount: 49 },
  { id: '7', name: 'Lena Fischer', plan: 'Team', status: 'Pending', amount: 250 },
  { id: '8', name: 'Omar Haddad', plan: 'Solo', status: 'Paid', amount: 49 },
  { id: '9', name: 'Yuki Tanaka', plan: 'Team', status: 'Overdue', amount: 250 },
  { id: '10', name: 'Ines Moreau', plan: 'Solo', status: 'Paid', amount: 49 },
  { id: '11', name: 'Kofi Mensah', plan: 'Team', status: 'Paid', amount: 250 },
  { id: '12', name: 'Nora Lindqvist', plan: 'Solo', status: 'Pending', amount: 49 },
];
const PAGE02 = 5;

// 51-data-table-demo — 12 payments, filter / sort / columns / select / paginate
const DATA51 = [
  { id: 'm5gr84i9', amount: 316, status: 'success', email: 'ken99@example.com' },
  { id: '3u1reuv4', amount: 242, status: 'success', email: 'Abe45@example.com' },
  { id: 'derv1ws0', amount: 837, status: 'processing', email: 'Monserrat44@example.com' },
  { id: '5kma53ae', amount: 874, status: 'success', email: 'Silas22@example.com' },
  { id: 'bhqecj4p', amount: 721, status: 'failed', email: 'carmella@example.com' },
  { id: 'p0d9x2lq', amount: 129, status: 'pending', email: 'jo.okafor@example.com' },
  { id: 'v7t3n8ws', amount: 458, status: 'success', email: 'mika.k@example.com' },
  { id: 'c2h6y1rb', amount: 63, status: 'failed', email: 'sam.reyes@example.com' },
  { id: 'k9f4a5ze', amount: 590, status: 'processing', email: 'priya@example.com' },
  { id: 'x3m8u0dj', amount: 205, status: 'success', email: 'tomas.berg@example.com' },
  { id: 'q1w7e5tn', amount: 912, status: 'pending', email: 'lena.f@example.com' },
  { id: 'z6b2g4ho', amount: 377, status: 'success', email: 'omar@example.com' },
];
const PAGE51 = 5;
const COL_KEYS = [
  { id: 'status', label: 'status' },
  { id: 'email', label: 'email' },
  { id: 'amount', label: 'amount' },
];

// 04-team — a card holding a table of seats with faces and a footer total
const seats = [
  { name: 'Ada Lovelace', email: 'ada@looseleaf.dev', role: 'Owner', status: 'online', price: 25 },
  { name: 'Jo Okafor', email: 'jo@looseleaf.dev', role: 'Admin', status: 'busy', price: 25 },
  { name: 'Mika Kobayashi', email: 'mika@looseleaf.dev', role: 'Member', status: 'away', price: 12 },
  { name: 'Sam Reyes', email: 'sam@looseleaf.dev', role: 'Member', status: 'offline', price: 12 },
];
const seatsTotal = '$' + seats.reduce((sum, s) => sum + s.price, 0).toFixed(2);

const dollars = (n) => '$' + n.toFixed(2);

function compute02(sort, sel, page) {
  let rows = DATA02.slice();
  if (sort) {
    const sign = sort.dir === 'asc' ? 1 : -1;
    rows.sort((a, b) => {
      const x = a[sort.key];
      const y = b[sort.key];
      const d = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y));
      return d * sign;
    });
  }
  const pageCount = Math.ceil(rows.length / PAGE02);
  const p = Math.min(page, pageCount - 1);
  const visible = rows.slice(p * PAGE02, p * PAGE02 + PAGE02).map((r) => {
    const s = !!sel[r.id];
    const tone = r.status === 'Paid' ? 'tone-green' : r.status === 'Pending' ? 'tone-muted' : 'tone-red';
    return {
      id: r.id,
      name: r.name,
      plan: r.plan,
      status: r.status,
      sel: s,
      statusCls: s ? 'tone-ink' : tone,
      amountStr: dollars(r.amount),
    };
  });
  const chosen = visible.filter((r) => r.sel).length;
  const chosenTotal = DATA02.filter((r) => sel[r.id]).length;
  const heads = ['name', 'plan', 'status', 'amount'].map((k) => {
    const active = sort && sort.key === k;
    return {
      k,
      label: k === 'name' ? 'Name' : k === 'plan' ? 'Plan' : k === 'status' ? 'Status' : 'Amount',
      end: k === 'amount',
      sort: active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none',
      icon: active ? (sort.dir === 'asc' ? 'arrow-up' : 'arrow-down') : 'chevrons-up-down',
      dim: !active,
    };
  });
  return {
    heads02: heads,
    rows02: visible,
    pages02: pageCount,
    page02: p,
    chosen02: chosen,
    all02: visible.length > 0 && chosen === visible.length,
    some02: chosen > 0 && chosen < visible.length,
    summary02: chosenTotal + ' of ' + DATA02.length + ' chosen · page ' + (p + 1) + ' of ' + pageCount,
  };
}

function compute51(filter, sorting, vis, sel, page, rowMenu) {
  const f = filter.toLowerCase();
  let rows = DATA51.filter((p2) => p2.email.toLowerCase().indexOf(f) !== -1);
  if (sorting) {
    const sign = sorting === 'asc' ? 1 : -1;
    rows = rows.slice().sort((a, b) => a.email.toLowerCase().localeCompare(b.email.toLowerCase()) * sign);
  }
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE51));
  const p = Math.min(page, pageCount - 1);
  const pageRows = rows.slice(p * PAGE51, (p + 1) * PAGE51).map((r) => ({
    id: r.id,
    email: r.email,
    status: r.status,
    sel: !!sel[r.id],
    amountStr: dollars(r.amount),
    /* the row keeps its own stacking context (isolation for the
       highlighter), so the row with an open slip must be lifted above the
       rows painted after it — upstream portals the menu to <body> */
    z: rowMenu === r.id ? 'z-index:40;' : '',
  }));
  const chosenOnPage = pageRows.filter((r) => r.sel).length;
  const chosenInFilter = rows.filter((r) => sel[r.id]).length;
  return {
    rows51: pageRows,
    pageCount51: pageCount,
    page51: p,
    all51: pageRows.length > 0 && chosenOnPage === pageRows.length,
    some51: chosenOnPage > 0 && chosenOnPage < pageRows.length,
    empty51: rows.length === 0,
    summary51:
      chosenInFilter + ' of ' + rows.length + ' row(s) selected. Page ' + (p + 1) + ' of ' + pageCount + '.',
  };
}

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    invoices01,
    invoices50,
    pages,
    seats,
    seatsTotal,
    // 02 data table
    sort02: null,
    sel02: { 3: true },
    page02: 0,
    ...compute02(null, { 3: true }, 0),
    // 51 data table demo
    filter51: '',
    sort51: null,
    vis51: { status: true, email: true, amount: true },
    sel51: {},
    page51: 0,
    colsOpen: false,
    rowMenu: '',
    colKeys: COL_KEYS,
    ...compute51('', null, { status: true, email: true, amount: true }, {}, 0, ''),
  },
  methods: {
    // -- 02: sort / select / paginate ------------------------------------
    onSort02(e) {
      const k = e.currentTarget.dataset.k;
      const s = this.data.sort02;
      const sort = !s || s.key !== k ? { key: k, dir: 'asc' } : s.dir === 'asc' ? { key: k, dir: 'desc' } : null;
      this.setData({ sort02: sort, ...compute02(sort, this.data.sel02, this.data.page02) });
    },
    onSelAll02(e) {
      const on = !!e.detail.value;
      const sel = { ...this.data.sel02 };
      this.data.rows02.forEach((r) => {
        if (on) sel[r.id] = true;
        else delete sel[r.id];
      });
      this.setData({ sel02: sel, ...compute02(this.data.sort02, sel, this.data.page02) });
    },
    onSelOne02(e) {
      const id = e.currentTarget.dataset.id;
      const sel = { ...this.data.sel02 };
      if (e.detail.value) sel[id] = true;
      else delete sel[id];
      this.setData({ sel02: sel, ...compute02(this.data.sort02, sel, this.data.page02) });
    },
    onPrev02() {
      this.setData({ page02: this.data.page02 - 1, ...compute02(this.data.sort02, this.data.sel02, this.data.page02 - 1) });
    },
    onNext02() {
      this.setData({ page02: this.data.page02 + 1, ...compute02(this.data.sort02, this.data.sel02, this.data.page02 + 1) });
    },
    // -- 51: filter / sort / columns / select / paginate -----------------
    onFilter51(e) {
      this.setData({ filter51: e.detail.value, page51: 0, ...compute51(e.detail.value, this.data.sort51, this.data.vis51, this.data.sel51, 0, this.data.rowMenu) });
    },
    onSort51() {
      const sort = this.data.sort51 === 'asc' ? 'desc' : 'asc';
      this.setData({ sort51: sort, ...compute51(this.data.filter51, sort, this.data.vis51, this.data.sel51, this.data.page51, this.data.rowMenu) });
    },
    onColToggle(e) {
      const id = e.currentTarget.dataset.id;
      const vis = { ...this.data.vis51, [id]: !!e.detail.checked };
      this.setData({ vis51: vis, ...compute51(this.data.filter51, this.data.sort51, vis, this.data.sel51, this.data.page51, this.data.rowMenu) });
    },
    onSelAll51(e) {
      const on = !!e.detail.value;
      const sel = { ...this.data.sel51 };
      this.data.rows51.forEach((r) => {
        if (on) sel[r.id] = true;
        else delete sel[r.id];
      });
      this.setData({ sel51: sel, ...compute51(this.data.filter51, this.data.sort51, this.data.vis51, sel, this.data.page51, this.data.rowMenu) });
    },
    onSelOne51(e) {
      const id = e.currentTarget.dataset.id;
      const sel = { ...this.data.sel51 };
      if (e.detail.value) sel[id] = true;
      else delete sel[id];
      this.setData({ sel51: sel, ...compute51(this.data.filter51, this.data.sort51, this.data.vis51, sel, this.data.page51, this.data.rowMenu) });
    },
    onPrev51() {
      this.setData({ page51: this.data.page51 - 1, ...compute51(this.data.filter51, this.data.sort51, this.data.vis51, this.data.sel51, this.data.page51 - 1, this.data.rowMenu) });
    },
    onNext51() {
      this.setData({ page51: this.data.page51 + 1, ...compute51(this.data.filter51, this.data.sort51, this.data.vis51, this.data.sel51, this.data.page51 + 1, this.data.rowMenu) });
    },
    onMenuOpen(e) {
      this.setData({ [e.currentTarget.dataset.k]: e.detail.value });
    },
    onRowMenuChange(e) {
      const rowMenu = e.detail.value ? e.currentTarget.dataset.rowid : '';
      this.setData({ rowMenu, ...compute51(this.data.filter51, this.data.sort51, this.data.vis51, this.data.sel51, this.data.page51, rowMenu) });
    },
    onCopyId(e) {
      const id = e.currentTarget.dataset.id;
      this.setData({ rowMenu: '' });
      if (typeof wx !== 'undefined' && wx.setClipboardData) wx.setClipboardData({ data: id });
    },
    onCloseRowMenu() {
      this.setData({ rowMenu: '' });
    },
    noop() {},
  },
});
