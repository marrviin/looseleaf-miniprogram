const countOf = (articles) => articles.filter((a) => a.saved).length;

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    tones: ['tomato', 'tangerine', 'lemon', 'grass', 'teal', 'sky', 'grape', 'bubblegum'],
    articles: [
      { id: 'margin', title: 'Why the margin is the best part', meta: 'Notebook - 4 min', tone: 'tomato', tilt: -0.2, saved: false },
      { id: 'paper', title: 'On paper that has tooth', meta: 'Materials - 6 min', tone: 'teal', tilt: 0.2, saved: true },
      { id: 'hands', title: 'Nothing is drawn straight', meta: 'Craft - 3 min', tone: 'tomato', tilt: -0.2, saved: false },
    ],
    count: 1,
  },
  methods: {
    onPreview(e) {
      return { pressed: e.detail.pressed };
    },
    onSaved(e) {
      // data-id rides the event's currentTarget (the bookmark is in a wx:for)
      const id = e.currentTarget.dataset.id;
      const articles = this.data.articles.map((a) =>
        a.id === id ? { ...a, saved: e.detail.pressed } : a,
      );
      this.setData({ articles, count: countOf(articles) });
      return { id, saved: e.detail.pressed };
    },
    /** Verification hook: toggle a reading-list bookmark. */
    pressBookmark(id) {
      const bm = this.selectComponent(`#bm-${id}`);
      if (!bm) return { ok: false };
      bm.onTap();
      return { ok: true, count: countOf(this.data.articles) };
    },
  },
});
