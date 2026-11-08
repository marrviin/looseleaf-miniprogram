// ll-command demo — mirrors the upstream docs page (#/components/command).
// Four examples: the shadcn default palette, the palette in a dialog,
// empty + loading states with filtering off, and a status picker in a
// popover. WeChat has no arrow keys — the highlight marks the first match
// and picking is a tap.
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01: what was picked from the default palette
    said: 'Pick a command.',
    // 02: the dialog palette
    dlgOpen: false,
    dlgSaid: 'Nothing run yet.',
    // 03: server search — filtering off, fake 700ms fetch
    query: '',
    busy: false,
    results: [],
    docs: [
      'Invoice 0142',
      'Invoice 0143',
      'Invoice 0150',
      'Inventory count',
      'Invitation list',
    ],
    // 04: the status picker
    statusOpen: false,
    status: 'todo',
    statusLabel: 'To do',
    statuses: [
      { value: 'backlog', label: 'Backlog' },
      { value: 'todo', label: 'To do' },
      { value: 'in-progress', label: 'In progress' },
      { value: 'done', label: 'Done' },
      { value: 'canceled', label: 'Canceled' },
    ],
  },
  methods: {
    onPick(e) {
      this.setData({ said: `Ran: ${e.detail.value}` });
    },
    onDialogChange(e) {
      this.setData({ dlgOpen: e.detail.value });
    },
    onDialogOpen() {
      this.setData({ dlgOpen: true });
    },
    onDialogPick(e) {
      this.setData({ dlgOpen: false, dlgSaid: `Ran: ${e.detail.value}` });
    },
    onQuery(e) {
      const q = e.detail.value;
      if (this.__fetchTimer) clearTimeout(this.__fetchTimer);
      if (!q) {
        this.setData({ query: '', busy: false, results: [] });
        return;
      }
      this.setData({ query: q, busy: true });
      // the fake server round-trip
      this.__fetchTimer = setTimeout(() => {
        const results = this.data.docs.filter((d) =>
          d.toLowerCase().includes(q.toLowerCase())
        );
        this.setData({ busy: false, results });
      }, 700);
    },
    onStatusOpen() {
      this.setData({ statusOpen: true });
    },
    onStatusChange(e) {
      this.setData({ statusOpen: e.detail.value });
    },
    onStatusPick(e) {
      const s = this.data.statuses.find((x) => x.label === e.detail.value);
      this.setData({
        status: s ? s.value : e.detail.value,
        statusLabel: s ? s.label : e.detail.value,
        statusOpen: false,
      });
    },
  },
});
