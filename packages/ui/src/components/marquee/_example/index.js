Page({
  data: {
    shopNews: ['Fresh bread at seven', 'Open late on Fridays', 'Ask about the rye'],
    masking: ['Handle with care', 'This side up'],
    striped: ['New arrivals', 'Restocked today'],
    gingham: ['Picnic season', 'Bring a blanket'],
    announcements: [
      'Spring sale: everything ten off',
      'Free shipping over 40',
      'New: the felt-tip collection',
    ],
    said: '',
  },
  onPaused(e) {
    this.setData({ said: e.detail.paused ? 'Paused' : 'Playing' });
  },
});
