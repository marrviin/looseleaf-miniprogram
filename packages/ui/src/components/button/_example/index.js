Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    phase: 'idle', // Loading, composed: idle -> saving -> saved -> idle
    sending: false, // Loading, with a spinner
    shown: false, // Icon buttons toggle
  },
  lifetimes: {
    detached() {
      if (this._t1) clearTimeout(this._t1);
      if (this._t2) clearTimeout(this._t2);
    },
  },
  methods: {
    save() {
      const d = this.data;
      if (d.phase !== 'idle') return;
      this.setData({ phase: 'saving' });
      this._t1 = setTimeout(() => {
        this.setData({ phase: 'saved' });
        this._t2 = setTimeout(() => this.setData({ phase: 'idle' }), 1600);
      }, 1400);
    },
    send() {
      if (this.data.sending) return;
      this.setData({ sending: true });
      this._t1 = setTimeout(() => this.setData({ sending: false }), 2200);
    },
    toggleShown() {
      this.setData({ shown: !this.data.shown });
    },
  },
});
