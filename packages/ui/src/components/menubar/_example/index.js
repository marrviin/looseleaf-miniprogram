// ll-menubar demo — mirrors the upstream docs page (#/components/menubar).
// Menus are uncontrolled: each title toggles its slip; the bar closes the
// others, so only one is open at a time.
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01: the shadcn demo's state
    bookmarks: false,
    urls: true,
    profile: 'benoit',
    shareOpen: false,
    findOpen: false,
    // 02: the format menu acts on the sheet below the bar
    bold: false,
    italic: false,
    paper: 'ruled',
    // 03: the app header reports what was chosen
    said: 'Nothing chosen yet.',
    // 50: fixed sub-menus
    bShareOpen: false,
    bFindOpen: false,
  },
  methods: {
    onMenuChange(e) {
      this.setData({ [e.currentTarget.dataset.k]: e.detail.value });
    },
    onAppPick() {},
    onTickBookmarks(e) {
      this.setData({ bookmarks: e.detail.checked });
    },
    onTickUrls(e) {
      this.setData({ urls: e.detail.checked });
    },
    onProfileChange(e) {
      this.setData({ profile: e.detail.value });
    },
    onTickBold(e) {
      this.setData({ bold: e.detail.checked });
    },
    onTickItalic(e) {
      this.setData({ italic: e.detail.checked });
    },
    onPaperChange(e) {
      this.setData({ paper: e.detail.value });
    },
    onHeaderPick(e) {
      this.setData({ said: e.currentTarget.dataset.name });
    },
  },
});
