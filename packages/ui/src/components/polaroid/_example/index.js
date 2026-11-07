Component({
  data: {
    n: 0,
    deving: true,
  },
  methods: {
    /** Re-create the print so the develop soak replays (upstream bumps the
        React key). */
    again() {
      this.setData({ deving: false });
      setTimeout(() => {
        this.setData({ deving: true, n: this.data.n + 1 });
      }, 0);
    },
  },
});
