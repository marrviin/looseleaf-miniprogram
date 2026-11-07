const STATUSES = {
  off: 'You will not hear about new notes.',
  muted: 'Following, with new notes muted.',
  on: 'You will get an email for every new note.',
};

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    following: false,
    muted: false,
    bookmarked: false,
    status: STATUSES.off,
  },
  methods: {
    onFollow(e) {
      const following = e.detail.pressed;
      const muted = following ? this.data.muted : false;
      this.setData({
        following,
        muted,
        status: !following ? STATUSES.off : muted ? STATUSES.muted : STATUSES.on,
      });
    },
    onMute(e) {
      const muted = e.detail.pressed;
      this.setData({ muted, status: muted ? STATUSES.muted : STATUSES.on });
    },
    onBookmark(e) {
      this.setData({ bookmarked: e.detail.pressed });
    },
  },
});
