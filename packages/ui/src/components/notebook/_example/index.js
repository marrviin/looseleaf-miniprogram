const NEXT = { mon: 'tue', tue: 'wed', wed: 'mon' };

Page({
  data: {
    weekPage: 'mon',
    nextPage: 'tue',
    pack: [
      { text: 'Passport, tickets, the good pen', done: true },
      { text: 'Waterproof notebook', done: true },
      { text: 'Two rolls of washi tape', done: false },
      { text: 'Tea (a lot)', done: false },
      { text: 'The very small pencil', done: false },
    ],
    shelf: [
      { tone: 'tomato', name: 'Field notes', band: true },
      { tone: 'teal', name: 'Recipes', band: true },
      { tone: 'sky', name: 'Sketches', band: true },
      { tone: 'grape', name: 'Letters', band: false },
      { tone: 'ink', name: 'Accounts', band: true },
    ],
    said: '',
  },
  onTurned(e) {
    const to = e.detail.to;
    this.setData({ weekPage: to, nextPage: NEXT[to] || 'mon', said: `Turned to ${to}` });
  },
  onPack(e) {
    const i = e.currentTarget.dataset.index;
    const done = !this.data.pack[i].done;
    this.setData({ [`pack[${i}].done`]: done });
  },
});
