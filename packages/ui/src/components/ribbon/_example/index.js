Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    tones: ['marker', 'hi', 'tangerine', 'lemon', 'grass', 'teal', 'sky', 'bubblegum', 'paper'],
    lastTone: '',
    shopTaps: 0,
  },
  methods: {
    onToneTap(e) {
      this.setData({ lastTone: e.detail.tone });
    },
    onShopTap() {
      this.setData({ shopTaps: this.data.shopTaps + 1 });
    },
    /** Verification hook: force the drawn hover layer (upstream mouse hover). */
    hoverRibbon(id, hovered) {
      const comp = this.selectComponent(id);
      if (!comp) return { ok: false };
      comp.setData({ hovered: !!hovered });
      return { ok: true, hovered: !!hovered };
    },
  },
});
