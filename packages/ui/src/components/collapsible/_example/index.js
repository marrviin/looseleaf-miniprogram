Page({
  data: { open: false },
  setOpen(e) {
    this.setData({ open: e.detail.open });
  },
});
