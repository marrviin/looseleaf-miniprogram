// ll-popover demo — mirrors the upstream docs page (#/components/popover).
// The trigger buttons live in each popover's trigger slot; page methods
// only set the controlled `open` state (automation can't tap into
// virtualHost components, and the trigger tap bubble handles real users).
const LINK = 'https://kevintngo.github.io/looseleaf/n/field-notes';

const DEMO_ROWS = [
  { label: 'Width', value: '100%' },
  { label: 'Max. width', value: '300px' },
  { label: 'Height', value: '25px' },
  { label: 'Max. height', value: 'none' },
];

const NOTES = [
  { label: 'Pinned slip', title: 'Pinned', body: 'A push-pin in stationery sky.', stock: 'slip', edge: '', tilt: true, tape: false, pin: 'sky' },
  { label: 'Taped kraft', title: 'Taped', body: 'Kraft paper under a strip of masking tape.', stock: 'kraft', edge: '', tilt: true, tape: 'top', pin: false },
  { label: 'Torn index card', title: 'Torn', body: 'An index card with a torn bottom edge.', stock: 'index-card', edge: { bottom: 'torn' }, tilt: true, tape: false, pin: false },
  { label: 'Sticky pink', title: 'Sticky', body: 'Turned a degree and a half.', stock: 'sticky-pink', edge: '', tilt: 1.5, tape: false, pin: 'grape' },
];

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 50-demo / 01-dimensions
    demoRows: DEMO_ROWS,
    dimRows: DEMO_ROWS,
    popDemo: false,
    popDims: false,
    // 02-arrow-and-sides — capitalized labels per upstream
    sides: [
      { v: 'top', label: 'Top' },
      { v: 'right', label: 'Right' },
      { v: 'bottom', label: 'Bottom' },
      { v: 'left', label: 'Left' },
    ],
    popSide: '',
    // 03-stocks-and-fasteners
    notes: NOTES,
    popNote: -1,
    // 04-share-link
    shareLink: LINK,
    copied: false,
    popShare: false,
  },
  methods: {
    // 50-demo / 01 / 04: simple toggles
    onPopChange(e) {
      const k = e.currentTarget.dataset.k;
      this.setData({ [k]: e.detail.value });
    },
    // 02: open on one side (tap again to close)
    onSideChange(e) {
      const s = e.currentTarget.dataset.s;
      this.setData({ popSide: e.detail.value ? s : '' });
    },
    openSide(e) {
      const s = e.currentTarget.dataset.s;
      this.setData({ popSide: this.data.popSide === s ? '' : s });
    },
    // 03: one note at a time
    onNoteChange(e) {
      const i = Number(e.currentTarget.dataset.i);
      this.setData({ popNote: e.detail.value ? i : -1 });
    },
    openNote(e) {
      const i = Number(e.currentTarget.dataset.i);
      this.setData({ popNote: this.data.popNote === i ? -1 : i });
    },
    // 04: copy confirm
    copyLink() {
      wx.setClipboardData({
        data: LINK,
        success: () => {
          this.setData({ copied: true });
          setTimeout(() => this.setData({ copied: false }), 1800);
        },
      });
    },
  },
});
