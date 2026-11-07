// ll-tooltip demo — mirrors the upstream docs page (#/components/tooltip).
// Touch adaptation: upstream opens on hover; here the note opens on
// long-press of the trigger, or via the controlled `open` (one note at a
// time — page methods set `tip`, since automation can't long-press into
// virtualHost components either).
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 50-demo, then 01–04: which note is open (-1 = none)
    tip: -1,
    // 01-icon-toolbar
    tools: [
      { icon: 'plus', label: 'Add to library' },
      { icon: 'pencil', label: 'Edit notebook' },
      { icon: 'copy', label: 'Duplicate' },
      { icon: 'trash', label: 'Move to bin' },
      { icon: 'settings', label: 'Settings' },
    ],
    // 02-sides-and-notes — capitalized labels per upstream's capitalize class
    notes: [
      { v: 'top', label: 'Top', stock: 'sticky-yellow', text: 'Yellow, on top' },
      { v: 'right', label: 'Right', stock: 'sticky-blue', text: 'Blue, to the right' },
      { v: 'bottom', label: 'Bottom', stock: 'sticky-pink', text: 'Pink, below' },
      { v: 'left', label: 'Left', stock: 'slip', text: 'A plain slip, on the left' },
    ],
  },
  methods: {
    onTipChange(e) {
      const i = Number(e.currentTarget.dataset.i);
      this.setData({ tip: e.detail.value ? i : -1 });
    },
  },
});
