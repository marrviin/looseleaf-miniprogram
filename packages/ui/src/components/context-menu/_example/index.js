// ll-context-menu demo — mirrors the upstream docs page (#/components/context-menu).
// Every slip opens on a long-press of its region (the phone stand-in for
// the right-click) and closes on the next tap anywhere else.
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01: the shadcn demo's state
    bookmarks: true,
    urls: false,
    person: 'pedro',
    subOpen: false,
    // 02: one menu per row; the pick is reported below the list
    files: [
      { name: 'Field notes.md', icon: 'file-text' },
      { name: 'Garden log.md', icon: 'file-text' },
      { name: 'Recipes', icon: 'folder' },
      { name: 'Sketches', icon: 'folder' },
    ],
    picked: 'Long-press a row.',
    // 03: pen picker on the sticky note
    pen: 'felt',
    penLabel: 'felt tip',
    pens: [
      { value: 'felt', label: 'felt tip' },
      { value: 'pencil', label: 'pencil' },
      { value: 'marker', label: 'marker' },
      { value: 'highlighter', label: 'highlighter' },
    ],
    lines: 2,
  },
  methods: {
    onMenuChange(e) {
      this.setData({ [e.currentTarget.dataset.k]: e.detail.value });
    },
    onMenuPick() {},
    onTickBookmarks(e) {
      this.setData({ bookmarks: e.detail.checked });
    },
    onTickUrls(e) {
      this.setData({ urls: e.detail.checked });
    },
    onPersonChange(e) {
      this.setData({ person: e.detail.value });
    },
    onFilePick(e) {
      const { name, verb } = e.currentTarget.dataset;
      this.setData({ picked: `${verb} ${name}` });
    },
    onPenChange(e) {
      const v = e.detail.value;
      const p = this.data.pens.find((x) => x.value === v);
      this.setData({ pen: v, penLabel: p ? p.label : v });
    },
    onAddLine() {
      this.setData({ lines: this.data.lines + 1 });
    },
    onRemoveLine() {
      this.setData({ lines: Math.max(1, this.data.lines - 1) });
    },
  },
});
