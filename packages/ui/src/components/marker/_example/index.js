Component({
  data: {
    read: false,
  },
  methods: {
    markRead() {
      this.setData({ read: true });
    },
  },
});
