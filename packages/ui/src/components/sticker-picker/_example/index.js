Page({
  data: {
    // 01 — the whole catalog behind one button
    name: '',
    // 02 — a reaction picker: your own four words, stays open
    reactions: [
      { name: 'thumbs-up', label: 'Nice', category: 'Reactions', tags: ['like', 'good'] },
      { name: 'party-popper', label: 'Celebrate', category: 'Reactions', tags: ['party', 'yay'] },
      { name: 'heart-eyes', label: 'Love it', category: 'Reactions', tags: ['love', 'heart'] },
      { name: 'thinking-face', label: 'Hmm', category: 'Reactions', tags: ['think', 'unsure'] },
      { name: 'done', label: 'Done', category: 'Reactions', tags: ['finished', 'complete'] },
      { name: 'wow', label: 'Wow', category: 'Reactions', tags: ['surprised'] },
      { name: 'ok', label: 'OK', category: 'Reactions', tags: ['fine', 'agree'] },
      { name: 'eyes-look', label: 'Looking', category: 'Reactions', tags: ['watching', 'see'] },
    ],
    mine: [],
    // 03 — in a comment box
    text: '',
    sticker: '',
    recent: ['stamp-approved'],
    posts: [{ who: 'Maya', text: 'The new cover reads much better.', sticker: 'stamp-approved' }],
  },

  onPick(e) {
    this.setData({ name: e.detail.name });
  },
  onReact(e) {
    const { name } = e.detail;
    const mine = this.data.mine.includes(name)
      ? this.data.mine.filter((n) => n !== name)
      : [...this.data.mine, name];
    this.setData({ mine });
  },
  onComposerPick(e) {
    this.setData({
      sticker: e.detail.name,
      recent: [e.detail.name, ...this.data.recent.filter((n) => n !== e.detail.name)].slice(0, 5),
    });
  },
  onUnstick() {
    this.setData({ sticker: '' });
  },
  onText(e) {
    this.setData({ text: e.detail.value });
  },
  onPost() {
    const { text, sticker, posts } = this.data;
    if (!text.trim() && !sticker) return;
    this.setData({
      posts: [...posts, { who: 'You', text: text.trim(), sticker }],
      text: '',
      sticker: '',
    });
  },
});
