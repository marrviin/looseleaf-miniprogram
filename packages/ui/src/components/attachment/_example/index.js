Page({
  data: {
    liveValue: 0,
    liveDone: false,
    liveRun: 0,
    prints: [
      { name: 'harbour.jpg', size: '1.8 MB', doodle: 'sun', tint: 'background-color:rgba(186,222,248,0.45);' },
      { name: 'sketch-04.png', size: '620 KB', doodle: 'flower', tint: 'background-color:rgba(250,240,140,0.5);' },
      { name: 'mushrooms.jpg', size: '2.1 MB', doodle: 'mushroom', tint: 'background-color:rgba(244,194,205,0.4);' },
      { name: 'night.jpg', size: '980 KB', doodle: 'star', tint: 'background-color:rgba(167,203,170,0.4);' },
    ],
  },
  onLoad() {
    this.__timer = null;
  },
  onUnload() {
    if (this.__timer) clearInterval(this.__timer);
  },
  startLive() {
    if (this.__timer) clearInterval(this.__timer);
    this.setData({ liveValue: 0, liveDone: false });
    this.__timer = setInterval(() => {
      const v = this.data.liveValue;
      if (v >= 100) {
        clearInterval(this.__timer);
        this.__timer = null;
        this.setData({ liveDone: true });
        return;
      }
      this.setData({ liveValue: Math.min(100, v + 7) });
    }, 220);
  },
  onLiveAction() {
    if (this.data.liveDone) this.startLive();
  },
  onPrintOpen(e) {
    wx.showToast({ title: 'Opening ' + (e.currentTarget.dataset.name || ''), icon: 'none' });
  },
});
