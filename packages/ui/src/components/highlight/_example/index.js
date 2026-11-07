// ll-highlight demo — mirrors the upstream docs page (#/components/highlight).
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 03-wrapping: the replay button redraws the animated swipe.
    hlOn: true,
  },
  methods: {
    onReplay() {
      this.setData({ hlOn: false });
      setTimeout(() => this.setData({ hlOn: true }), 60);
    },
  },
});
