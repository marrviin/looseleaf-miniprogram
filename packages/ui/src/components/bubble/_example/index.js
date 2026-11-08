Page({
  data: {
    variants: [
      { v: 'default', align: 'start', say: 'Can you add tags to my notes?' },
      { v: 'secondary', align: 'end', say: 'Tags, then a filter row above the list.' },
      { v: 'muted', align: 'start', say: 'Sure. Give me a minute, I will look at the list first.' },
      { v: 'tinted', align: 'end', say: 'Two tags per note is plenty, I think.' },
      { v: 'outline', align: 'start', say: 'And a way to remove them again?' },
      { v: 'destructive', align: 'end', say: 'That would delete every tag. Are you sure?' },
    ],
    replies: ['Show me the diff', 'Run the tests', 'Not now, thanks'],
    picked: '',
    notePaper: { tilt: -1.6 },
    stickyPaper: { tilt: 1.8, fastener: 'pin' },
    sticky2Paper: { tilt: -1.4 },
  },
  pickReply(e) {
    this.setData({ picked: e.currentTarget.dataset.reply });
  },
});
