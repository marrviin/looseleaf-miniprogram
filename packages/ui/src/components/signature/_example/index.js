Page({
  data: {
    signed: true,
  },
  /** 03 — pull the name off the page and sign it again. */
  signAgain() {
    this.setData({ signed: false });
    setTimeout(() => this.setData({ signed: true }), 60);
  },
});
