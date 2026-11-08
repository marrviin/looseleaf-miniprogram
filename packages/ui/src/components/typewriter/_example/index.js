Page({
  data: {
    rotating: ['notebooks', 'stickers', 'tape', 'small good things'],
    receipt: ['ORDER 0042', 'one croissant', 'one coffee, black', 'one apology', '', 'TOTAL  a smile'],
    done: false,
  },
  onDone() {
    this.setData({ done: true });
  },
  printAnother() {
    this.setData({ done: false });
    const tw = this.selectComponent('#receipt-tw');
    if (tw) tw.restart();
  },
});
