const PACK = [
  { text: 'Passport, tickets', done: true },
  { text: 'Waterproof notebook', done: true },
  { text: 'Two rolls of washi', done: false },
  { text: 'Tea (a lot)', done: false },
  { text: 'The very small pencil', done: false },
];

const TONES = [
  { tone: 'hardboard', tilt: -1, list: ['milk', 'eggs', 'tea'] },
  { tone: 'teal', tilt: 1, list: ['rent', 'post', 'call'] },
  { tone: 'tomato', tilt: -1, list: ['jam', 'figs', 'rye'] },
];

Page({
  data: {
    pack: PACK,
    tones: TONES,
    who: ['Ada Lovelace', 'Grace Hopper'],
    name: '',
    said: '',
  },
  onPack(e) {
    const i = e.currentTarget.dataset.index;
    const done = !this.data.pack[i].done;
    this.setData({ [`pack[${i}].done`]: done });
  },
  onName(e) {
    this.setData({ name: e.detail.value });
  },
  onSign() {
    const name = (this.data.name || '').trim();
    if (!name) return;
    const who = this.data.who.concat(name);
    this.setData({ who, name: '', said: `${name} signed in` });
  },
});
