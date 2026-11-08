Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01-the-composer
    sent: [],
    // 02-while-a-reply-streams
    status: 'ready', // ready | submitted | streaming
    // 03-slash-commands-and-mentions
    mention: 'Thanks @',
    mentionTriggers: [
      { char: '/', atStart: true },
      { char: '@' },
    ],
    mentionSugs: [
      { char: '/', text: 'summarize', hint: 'Sum up the thread', icon: 'slash' },
      { char: '/', text: 'draw', hint: 'Sketch a diagram', icon: 'slash' },
      { char: '/', text: 'clear', hint: 'Start a fresh page', icon: 'slash' },
      { char: '@', text: 'Ada', icon: 'user' },
      { char: '@', text: 'Lin', icon: 'user' },
      { char: '@', text: 'Stubby', icon: 'user' },
      { char: '@', text: 'Grace', icon: 'user' },
    ],
    mentionSaid: '',
    // 04-with-attachments
    files: [{ id: 1, name: 'field-notes.pdf', size: '2.4 MB' }],
    attachSaid: '',
  },
  lifetimes: {
    detached() {
      this.__clearTimers();
    },
  },
  methods: {
    // 01 — every submit appends a line to the sent list
    onComposerSubmit(e) {
      this.setData({ sent: this.data.sent.concat(e.detail.value) });
    },
    // 02 — submitted → streaming → ready, like upstream's timers
    onStreamSend() {
      this.__clearTimers();
      this.setData({ status: 'submitted' });
      this.__timers = [
        setTimeout(() => this.setData({ status: 'streaming' }), 700),
        setTimeout(() => this.setData({ status: 'ready' }), 4200),
      ];
    },
    onStreamStop() {
      this.__clearTimers();
      this.setData({ status: 'ready' });
    },
    __clearTimers() {
      (this.__timers || []).forEach((t) => clearTimeout(t));
      this.__timers = [];
    },
    // 03 — the composer holds the text; the slip replaces the trigger word
    onMentionValue(e) {
      this.setData({ mention: e.detail.value });
    },
    onMentionPick(e) {
      this.setData({ mentionSaid: `Inserted ${e.detail.insert}.` });
    },
    // 04 — sending clears the chip row; the x takes one chip away
    onAttachSubmit() {
      this.setData({ files: [], attachSaid: 'Sent with the attachments.' });
    },
    onRemoveFile(e) {
      const id = e.currentTarget.dataset.id;
      this.setData({
        files: this.data.files.filter((f) => f.id !== id),
        attachSaid: 'File removed.',
      });
    },
  },
});
