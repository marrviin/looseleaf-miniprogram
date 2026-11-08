Page({
  data: {
    done: [
      { text: 'Ink the outline', done: true },
      { text: 'Wash the sky, then wait', done: true },
      { text: 'Hatch the shade', done: false },
    ],
    said: '',
  },
  onSave() {
    this.setData({ said: 'Page saved' });
  },
  onCheck(e) {
    const i = e.currentTarget.dataset.index;
    const done = !this.data.done[i].done;
    this.setData({ [`done[${i}].done`]: done });
  },
  onFile() {
    this.setData({ said: 'Review filed' });
  },
});
