const DECK = [
  ['la maison', 'the house'],
  ['le chat', 'the cat'],
  ["l'encre", 'the ink'],
  ['le crayon', 'the pencil'],
];

Page({
  data: {
    deck: DECK,
    deckIndex: 0,
    deckWord: DECK[0][0],
    deckMeaning: DECK[0][1],
    flipped: false,
    said: '',
  },
  onFlipped(e) {
    this.setData({ flipped: e.detail.flipped });
  },
  go(d) {
    const n = DECK.length;
    const i = (this.data.deckIndex + d + n) % n;
    this.setData({
      deckIndex: i,
      deckWord: DECK[i][0],
      deckMeaning: DECK[i][1],
      flipped: false,
    });
  },
  deckBack() {
    this.go(-1);
  },
  deckNext() {
    this.go(1);
  },
  flipPass() {
    const fc = this.selectComponent('#fc-pass');
    if (fc) fc.toggle();
  },
  bookDesk() {
    this.setData({ said: 'Desk booked' });
  },
});
