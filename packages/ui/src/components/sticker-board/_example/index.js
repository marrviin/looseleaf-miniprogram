const START = [
  { id: 'planet', name: 'ringed-planet', x: 100, y: 110, rot: -8, scale: 1.15, z: 0 },
  { id: 'rocket', name: 'rocket', x: 240, y: 90, rot: 24, scale: 1, z: 1 },
  { id: 'cloud', name: 'cloud-smile', x: 265, y: 170, rot: -3, scale: 1.05, z: 2 },
  { id: 'sun', name: 'sun-shades', x: 165, y: 250, rot: 10, scale: 1.2, z: 3 },
  { id: 'done', name: 'done', x: 90, y: 320, rot: 6, scale: 0.9, z: 4 },
];

const EARNED = [
  { id: 'a', name: 'a-plus', x: 80, y: 90, rot: -6, scale: 0.9, z: 0 },
  { id: 'b', name: 'hundred', x: 190, y: 84, rot: 8, scale: 0.9, z: 1 },
  { id: 'c', name: 'first-place', x: 290, y: 96, rot: -4, scale: 0.9, z: 2 },
  { id: 'd', name: 'rating-five', x: 120, y: 210, rot: 3, scale: 0.9, z: 3 },
  { id: 'e', name: 'number-one', x: 240, y: 216, rot: -9, scale: 0.9, z: 4 },
];

const ADDABLE = ['rocket', 'cloud-smile', 'first-place', 'stamp-approved'];

Page({
  data: {
    addable: ADDABLE,
    // 01 — stick things down (uncontrolled starting set)
    start: START,
    // 02 — the value is JSON (controlled)
    items: [],
    said: 'Press a button to stick something down.',
    exported: '',
    // 03 — a reward chart (read-only display)
    earned: EARNED,
    // 04 — board and picker
    b4: [],
    recent: [],
    count4: 'Start with a sticker.',
  },

  // 02 — controlled: the board reports, the page owns the array
  onValue(e) {
    const items = e.detail.value;
    this.setData({
      items,
      itemsJson: JSON.stringify(items, null, 1),
      said: items.length ? `${items.length} on the page` : 'Cleared.',
    });
  },
  onAdd(e) {
    this.selectComponent('#board2').addSticker(e.currentTarget.dataset.name);
  },
  onClear() {
    this.setData({ items: [] });
  },
  onExport(e) {
    this.setData({ exported: `Exported ${e.detail.items.length} stickers as one SVG (${e.detail.svg.length} chars).` });
  },

  // 04 — the picker chooses, addSticker sticks
  onPick(e) {
    this.selectComponent('#board4').addSticker(e.detail.name);
    this.setData({
      recent: [e.detail.name, ...this.data.recent.filter((n) => n !== e.detail.name)].slice(0, 6),
    });
  },
  onValue4(e) {
    const n = e.detail.value.length;
    this.setData({
      b4: e.detail.value,
      count4: n === 0 ? 'Start with a sticker.' : `${n} on the page`,
    });
  },
});
