// ll-skeleton demo — mirrors the upstream docs page (#/components/skeleton).
// 03-loading-to-loaded: the skeleton and the content occupy the same room;
// Reload swaps back to the skeleton for 2.2s (upstream's timer).
const NOTES = [
  { title: 'Snail on a leaf', body: 'Three tries to get the shell to spiral the right way.' },
  { title: 'Teapot, three ways', body: 'The third one leaks. The second one is a hat.' },
];

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    loading: true,
    notes: NOTES,
  },
  lifetimes: {
    attached() {
      this.__load();
    },
    detached() {
      if (this.__timer) clearTimeout(this.__timer);
    },
  },
  methods: {
    onReload() {
      this.__load();
    },
    __load() {
      if (this.__timer) clearTimeout(this.__timer);
      this.setData({ loading: true });
      this.__timer = setTimeout(() => this.setData({ loading: false }), 2200);
    },
  },
});
