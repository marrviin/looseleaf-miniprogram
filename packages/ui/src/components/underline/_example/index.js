// ll-underline demo — mirrors the upstream docs page (#/components/underline).
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 03-wrapping: the replay button redraws the animated line.
    ulOn: true,
  },
  methods: {
    onReplay() {
      this.setData({ ulOn: false });
      setTimeout(() => this.setData({ ulOn: true }), 60);
    },
  },
});
