Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    keys: [
      { id: 'k-esc', label: 'Esc' },
      { id: 'k-tab', label: 'Tab' },
      { id: 'k-space', label: 'Space' },
      { id: 'k-enter', label: 'Enter' },
      { id: 'k-left', label: '←' },
      { id: 'k-up', label: '↑' },
      { id: 'k-down', label: '↓' },
      { id: 'k-right', label: '→' },
    ],
    shortcuts: [
      { what: 'Open the command palette', keys: ['Ctrl', 'K'] },
      { what: 'Save the page', keys: ['Ctrl', 'S'] },
      { what: 'Toggle the sidebar', keys: ['Ctrl', 'B'] },
      { what: 'Find in page', keys: ['Ctrl', 'F'] },
      { what: 'Close whatever is open', keys: ['Esc'] },
    ],
  },
  methods: {
    onKeyTouchStart(e) {
      const comp = this.selectComponent(`#${e.currentTarget.dataset.id}`);
      if (comp) comp.setData({ pressed: true });
    },
    onKeyTouchEnd(e) {
      const comp = this.selectComponent(`#${e.currentTarget.dataset.id}`);
      if (comp) comp.setData({ pressed: false });
    },
    /** Verification hook: hold a key programmatically. */
    holdKey(id, down) {
      const comp = this.selectComponent(`#${id}`);
      if (!comp) return { ok: false };
      comp.setData({ pressed: !!down });
      return { ok: true, pressed: !!down };
    },
    /** Verification hook: open a tooltip (upstream hover/focus). */
    openTooltip(id, open) {
      const comp = this.selectComponent(`#${id}`);
      if (!comp) return { ok: false };
      comp.setData({ open: !!open });
      return { ok: true, open: !!open };
    },
  },
});
