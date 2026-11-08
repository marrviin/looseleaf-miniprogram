Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    said: '',
    // An inbox — openId drives both envelopes; opening marks the letter read.
    openId: '',
    mail: [
      { id: 'ada', from: 'Ada', to: 'You', line: 'The flap is up, and the letter comes out.', stamp: 'tomato', read: false },
      { id: 'lin', from: 'Lin', to: 'You', line: 'The install page is written. Please read it.', stamp: 'sky', read: false },
    ],
  },
  methods: {
    onEnvelope(e) {
      const id = e.currentTarget.dataset.id;
      const open = e.detail.open;
      const mail = this.data.mail.map((m) => (m.id === id && open ? { ...m, read: true } : m));
      this.setData({ openId: open ? id : '', mail, inboxSaid: open ? `opened the letter from ${id}` : '' });
    },
  },
});
