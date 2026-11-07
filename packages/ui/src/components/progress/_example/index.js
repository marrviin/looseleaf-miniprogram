// ll-progress demo — mirrors the upstream docs page (#/components/progress).
const START = [
  { name: 'field-notes.pdf', size: '2.4 MB', pct: 8 },
  { name: 'garden-plan.png', size: '860 KB', pct: 52 },
  { name: 'receipts.zip', size: '14 MB', pct: null },
];
const STEPS = ['Name your notebook', 'Pick a cover', 'Add a first page', 'Invite someone', 'Done'];

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01-default: 13 → 66 half a second in
    value: 13,
    // 03-uploads
    files: START.map((f) => ({ ...f })),
    running: false,
    // 04-steps
    step: 2,
    steps: STEPS,
  },
  lifetimes: {
    attached() {
      // 01-default / 50-demo: the bar jumps to 66 shortly after load
      this.__t1 = setTimeout(() => this.setData({ value: 66 }), 600);
    },
    detached() {
      clearTimeout(this.__t1);
      clearInterval(this.__iv);
    },
  },
  methods: {
    onUploadToggle() {
      if (this.data.running) {
        clearInterval(this.__iv);
        this.setData({ running: false });
        return;
      }
      this.setData({ running: true });
      this.__iv = setInterval(() => {
        const files = this.data.files.map((f, i) => ({
          ...f,
          pct: f.pct === null ? 0 : Math.min(100, f.pct + 9 + i * 5),
        }));
        if (files.every((f) => f.pct === 100)) {
          clearInterval(this.__iv);
          this.setData({ files, running: false });
          return;
        }
        this.setData({ files });
      }, 500);
    },
    onUploadReset() {
      clearInterval(this.__iv);
      this.setData({ running: false, files: START.map((f) => ({ ...f })) });
    },
    onStepBack() {
      this.setData({ step: Math.max(1, this.data.step - 1) });
    },
    onStepNext() {
      this.setData({ step: Math.min(this.data.steps.length, this.data.step + 1) });
    },
  },
});
