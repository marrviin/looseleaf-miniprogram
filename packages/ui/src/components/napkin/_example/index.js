Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    note: '',
    sent: false,
  },
  methods: {
    onNote(e) {
      this.setData({ note: e.detail.value });
    },
    onSend() {
      this.setData({ sent: true });
    },
    /** Verification hook: fill the note and send it. */
    sendNote(text) {
      this.setData({ note: text || 'no nuts, please', sent: true });
      return { sent: this.data.sent, note: this.data.note };
    },
  },
});
