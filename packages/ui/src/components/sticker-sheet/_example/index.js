// ll-sticker-sheet demo — mirrors the upstream docs page
// (#/components/sticker-sheet). Upstream composes StickerSheetItem children;
// here the sheet takes plain `stickers` name lists (state cannot cross a
// slot in WeChat). "Sheet to board" needs ll-sticker-board and is deferred
// with a note, as is the per-item id/label API.
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    names: ['rocket', 'cloud-smile', 'sun-shades', 'ringed-planet', 'done', 'rainbow', 'first-place', 'number-one', 'a-plus', 'hundred', 'moon-sleepy', 'sale'],
    badges: ['wip', 'new', 'beta', 'pro', 'ok', 'wow'],
    kraftNames: ['rocket', 'cloud-smile', 'sun-shades', 'done', 'rainbow', 'sale'],
    plain: ['first-place', 'number-one', 'a-plus', 'hundred'],
    log: '',
  },
  methods: {
    onPeel(e) {
      const d = e.detail;
      this.setData({ log: `${d.label} peeled off.` });
    },
    onStick(e) {
      const d = e.detail;
      this.setData({ log: `${d.label} stuck back on.` });
    },
    /** Verification hooks: drive the first sheet's component instance. */
    sheetPeel(name) {
      const t = this.selectComponent('#sheet-one');
      return t ? t.sheetPeel(name) : { ok: false, why: 'not found' };
    },
    sheetStick(name) {
      const t = this.selectComponent('#sheet-one');
      return t ? t.sheetStick(name) : { ok: false, why: 'not found' };
    },
  },
});
