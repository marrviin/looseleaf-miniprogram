// ll-tear-off demo — mirrors the upstream docs page
// (#/components/tear-off). The third example is a controlled torn state
// (the book can be reset); the confetti stays inside the ticket.
Page({
  data: {
    said1: '',
    said2: '',
    // 03 — coupon book (controlled)
    torn3: false,
    redeemed: 0,
  },

  onTear1() {
    this.setData({ said1: 'Torn off.' });
  },
  onTear2() {
    this.setData({ said2: 'One free coffee, redeemed.' });
  },

  // 03 — a controlled torn state
  onTear3() {
    this.setData({ redeemed: this.data.redeemed + 1 });
  },
  onTorn3(e) {
    this.setData({ torn3: e.detail.torn });
  },
  onNewCoupon() {
    this.setData({ torn3: false });
  },
});
