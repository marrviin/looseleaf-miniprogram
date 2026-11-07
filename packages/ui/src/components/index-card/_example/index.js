const CARDS = [
  { q: 'petrichor', a: 'the smell of rain on dry earth' },
  { q: 'sonder', a: 'the realisation that everyone has a life as vivid as yours' },
  { q: 'komorebi', a: 'sunlight filtering through leaves' },
];

Component({
  data: {
    cards: CARDS,
    i: 0,
    shown: false,
    leftStack: CARDS.length - 1, // min(3, cards behind the top one)
  },
  methods: {
    flip() {
      this.setData({ shown: !this.data.shown });
    },
    next() {
      if (this.data.i === this.data.cards.length - 1) return;
      const i = this.data.i + 1;
      this.setData({ i, shown: false, leftStack: Math.min(3, CARDS.length - i - 1) });
    },
  },
});
