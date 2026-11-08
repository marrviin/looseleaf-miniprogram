Page({
  data: {
    stocks: ['paper', 'sticky-yellow', 'kraft', 'sticky-blue', 'index-card'],
    tallyStocks: ['sticky-yellow', 'index-card', 'kraft', 'paper', 'sticky-blue', 'graph', 'sticky-pink'],
    notes: ['Ink', 'A good eraser', 'Tape', 'Index cards', 'Washi (dots)', 'A ruler', 'Stamp pad'],
    reminders: ['Water the plants', 'Call the printer', 'Sharpen pencils', 'Post the letters'],
    current: 0,
  },
  onSelect(e) {
    this.setData({ current: e.detail.index });
  },
});
