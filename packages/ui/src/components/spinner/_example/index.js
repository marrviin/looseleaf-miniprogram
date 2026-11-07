// ll-spinner demo — mirrors the upstream docs page (#/components/spinner).
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    sizes: [12, 16, 24, 32, 48, 64],
    colors: [
      { label: 'ink-you', ink: '#2c4f9e' },
      { label: 'red', ink: '#c2412d' },
      { label: 'green', ink: '#3b7a4b' },
      { label: 'pencil', ink: '#6f6a60' },
    ],
    phase: 'idle',
  },
  lifetimes: {
    detached() {
      if (this.__timer) clearTimeout(this.__timer);
    },
  },
  methods: {
    save() {
      if (this.data.phase === 'saving') return;
      this.setData({ phase: 'saving' });
      this.__timer = setTimeout(() => {
        this.setData({ phase: 'saved' });
        this.__timer = setTimeout(() => this.setData({ phase: 'idle' }), 1400);
      }, 1800);
    },
  },
});
