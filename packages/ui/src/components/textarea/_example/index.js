// ll-textarea demo — mirrors the upstream docs page (#/components/textarea).
// Labels are plain text (WeChat has no htmlFor association).
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    message: '',
    diary: 'Dear diary,\ntoday I drew a box\nand it was mine.',
    bio: '',
    locked: 'Nothing to add.',
    printed: 'Printed in the margin: this one cannot be edited, only selected.',
    fbSubject: '',
    fbNote: '',
    fbSent: false,
    demoMsg: '',
    labelMsg: '',
    textMsg: '',
  },
  methods: {
    onMessageInput(e) {
      this.setData({ message: e.detail.value });
    },
    onBioInput(e) {
      this.setData({ bio: e.detail.value });
    },
    onFbSubjectInput(e) {
      this.setData({ fbSubject: e.detail.value });
    },
    onFbNoteInput(e) {
      this.setData({ fbNote: e.detail.value });
    },
    sendFeedback() {
      this.setData({ fbSent: true });
    },
    onDemoInput(e) {
      this.setData({ demoMsg: e.detail.value });
    },
    onLabelInput(e) {
      this.setData({ labelMsg: e.detail.value });
    },
    onTextInput(e) {
      this.setData({ textMsg: e.detail.value });
    },
  },
});
