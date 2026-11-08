Page({
  data: {
    hint: true,
  },
  onEmailFocus() {
    this.setData({ hint: false });
  },
  sendLink() {},
});
