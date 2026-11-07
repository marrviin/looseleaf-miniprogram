// ll-dropdown-menu demo — mirrors the upstream docs page
// (#/components/dropdown-menu). Menus are controlled from page state
// (bind:change syncs the trigger toggles); row handlers just update state,
// same code path automation and real users take.
const START_NOTEBOOKS = ['Field notes', 'Garden log', 'Recipes', 'Trip to Lisbon'];

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01-account
    acct: false,
    picked: '',
    // 02-ticks-and-dots
    ticksOpen: false,
    ticks: { status: true, activity: false, panel: true, position: 'bottom' },
    ticksLine: 'status bar + panel · panel bottom',
    // 03-slips
    slipsOpen: false,
    quickPicked: '',
    // 04-row-actions
    notebooks: START_NOTEBOOKS,
    rowsLast: '',
    rowMenu: -1,
    // 50-checkboxes
    cbsOpen: false,
    cbs: { statusBar: true, activityBar: false, panel: false },
    // 51-radio-group
    radioOpen: false,
    radioValue: 'bottom',
    // 52-dialog
    dlgMenuOpen: false,
    dlgNew: false,
    dlgShare: false,
  },
  methods: {
    // trigger toggles (one handler for the simple menus)
    onMenuChange(e) {
      const k = e.currentTarget.dataset.k;
      this.setData({ [k]: e.detail.value });
    },
    onRowMenuChange(e) {
      const i = Number(e.currentTarget.dataset.i);
      this.setData({ rowMenu: e.detail.value ? i : -1 });
    },

    // 01: rows close the menu (select bubbles to the slip, which closes
    // itself and emits change) — the page just records the pick
    onAcctPick(e) {
      this.setData({ picked: e.currentTarget.dataset.name });
    },

    // 02: choice rows keep the menu open; owner updates state
    onTickStatus(e) {
      this.setData({ 'ticks.status': e.detail.checked });
      this.__syncTicksLine();
    },
    onTickPanel(e) {
      this.setData({ 'ticks.panel': e.detail.checked });
      this.__syncTicksLine();
    },
    onTickPosition(e) {
      this.setData({ 'ticks.position': e.detail.value });
      this.__syncTicksLine();
    },
    __syncTicksLine() {
      const t = this.data.ticks;
      const line = [t.status && 'status bar', t.panel && 'panel'].filter(Boolean).join(' + ') || 'nothing';
      this.setData({ ticksLine: `${line} · panel ${t.position}` });
    },

    // 03
    onQuickPick(e) {
      this.setData({ quickPicked: e.currentTarget.dataset.name });
    },

    // 04
    onRowOpen(e) {
      const i = Number(e.currentTarget.dataset.i);
      this.setData({ rowsLast: `Opened ${this.data.notebooks[i]}` });
    },
    onRowRename(e) {
      const i = Number(e.currentTarget.dataset.i);
      this.setData({
        notebooks: this.data.notebooks.map((x, k) => (k === i ? `${x} (copy)` : x)),
      });
    },
    onRowTrash(e) {
      const i = Number(e.currentTarget.dataset.i);
      this.setData({
        notebooks: this.data.notebooks.filter((_, k) => k !== i),
        rowsLast: '',
        rowMenu: -1,
      });
    },

    // 50
    onCbStatus(e) {
      this.setData({ 'cbs.statusBar': e.detail.checked });
    },
    onCbPanel(e) {
      this.setData({ 'cbs.panel': e.detail.checked });
    },

    // 51
    onRadioChange(e) {
      this.setData({ radioValue: e.detail.value });
    },

    // 52: menu rows flip the dialogs' open state; dialogs live beside the menu
    onMenuNewFile() {
      this.setData({ dlgNew: true });
    },
    onMenuShareFile() {
      this.setData({ dlgShare: true });
    },
    onDlgChange(e) {
      const k = e.currentTarget.dataset.k;
      this.setData({ [k]: e.detail.value });
    },
    closeDlg(e) {
      this.setData({ [e.currentTarget.dataset.k]: false });
    },
  },
});
