// ll-sticker-sheet demo — mirrors the upstream docs page
// (#/components/sticker-sheet). Upstream composes StickerSheetItem children;
// here the sheet takes plain `stickers` name lists (state cannot cross a
// slot in WeChat), as is the per-item id/label API. "Sheet to board" (the
// third upstream example) peels onto an ll-sticker-board.
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    names: ['rocket', 'cloud-smile', 'sun-shades', 'ringed-planet', 'done', 'rainbow', 'first-place', 'number-one', 'a-plus', 'hundred', 'moon-sleepy', 'sale'],
    badges: ['wip', 'new', 'beta', 'pro', 'ok', 'wow'],
    kraftNames: ['rocket', 'cloud-smile', 'sun-shades', 'done', 'rainbow', 'sale'],
    plain: ['first-place', 'number-one', 'a-plus', 'hundred'],
    log: '',
    // "Sheet to board" — the sheet's peeled list is what lies on the board
    boardSaid: 'Peel a sticker off the sheet.',
    onBoard: [],
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
    // 03 — sheet to board: peel lands it on the board, sticking it back
    // on the sheet takes it off the board
    onBoardPeel(e) {
      const { name, label } = e.detail;
      if (this.data.onBoard.includes(name)) return;
      this.selectComponent('#s2b-board').addSticker(name);
      this.setData({ boardSaid: `${label} is on the board.` });
    },
    onBoardStick(e) {
      const { name, label } = e.detail;
      this.selectComponent('#s2b-board').removeName(name);
      this.setData({ boardSaid: `${label} is back on the sheet.` });
    },
    onBoardValue(e) {
      this.setData({ onBoard: e.detail.value.map((s) => s.name) });
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
