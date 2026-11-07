// ll-circled demo — mirrors the upstream docs page (#/components/circled).
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 03-answer-key: mark the right answer with the pen.
    showAnswer: false,
  },
  methods: {
    onToggleAnswer() {
      this.setData({ showAnswer: !this.data.showAnswer });
    },
  },
});
