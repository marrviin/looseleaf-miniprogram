// ll-stamp-button demo — mirrors the upstream docs page
// (#/components/stamp-button). The page wires each tool's `stamp` event to
// its surface's strike(); the third example is a controlled surface (the
// stamps are the review state).
Page({
  data: {
    said1: '',
    said2: '',
    // 03 — an approval (controlled)
    marks: [],
    status3: 'Waiting for review',
  },

  // 01 — stamp the page
  onStamp1(e) {
    this.selectComponent('#surface1').strike(e.detail);
    this.setData({ said1: `${e.detail.say || 'Stamp'} stamped.` });
  },

  // 02 — inks and shapes
  onStamp2(e) {
    this.selectComponent('#surface2').strike(e.detail);
    this.setData({ said2: `${e.detail.say || 'Stamp'} stamped.` });
  },

  // 03 — a controlled surface: the stamps are the state
  onStamp3(e) {
    this.selectComponent('#surface3').strike(e.detail);
  },
  onMarks3(e) {
    const marks = e.detail.value;
    const last = marks[marks.length - 1];
    this.setData({
      marks,
      status3: !last ? 'Waiting for review' : last.name === 'stamp-approved' ? 'Approved' : 'Rejected',
    });
  },
  onReset() {
    this.selectComponent('#surface3').clear();
  },
});
