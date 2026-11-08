Page({
  data: {
    effects: [
      { name: 'wipe', stock: 'index-card', tilt: -2, delay: '0' },
      { name: 'soak', stock: 'sticky-yellow', tilt: 2, delay: '0.08' },
      { name: 'drop', stock: 'index-card', tilt: -2, delay: '0.16' },
      { name: 'pop', stock: 'sticky-yellow', tilt: 2, delay: '0.24' },
      { name: 'toss', stock: 'index-card', tilt: -2, delay: '0.32' },
    ],
    features: [
      { text: 'Hand-drawn, every pixel', delay: '0' },
      { text: 'Accessible, every state', delay: '0.14' },
      { text: 'Keyboard first', delay: '0.28' },
      { text: 'Works without a mouse', delay: '0.42' },
      { text: 'Reduced motion respected', delay: '0.56' },
    ],
    said: '',
  },
  replayMain() {
    const rv = this.selectComponent('#rv-main');
    if (rv) rv.restart();
    this.setData({ said: 'Replayed' });
  },
});
