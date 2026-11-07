// ll-rating demo — mirrors the upstream docs page (#/components/rating).
// Hover preview has no touch equivalent; taps pick a glyph (or half) directly.
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01-default
    value: 3,
    // 03-review
    rating: 0,
    sent: '',
    // 04-survey
    pace: 4,
    snacks: 5,
    sun: 2,
  },
  methods: {
    onValue(e) {
      this.setData({ value: e.detail.value });
    },
    onRating(e) {
      this.setData({ rating: e.detail.value });
    },
    onPost() {
      this.setData({ sent: `Thanks: ${this.data.rating} stars` });
    },
    onPace(e) {
      this.setData({ pace: e.detail.value });
    },
    onSnacks(e) {
      this.setData({ snacks: e.detail.value });
    },
    onSun(e) {
      this.setData({ sun: e.detail.value });
    },
  },
});
