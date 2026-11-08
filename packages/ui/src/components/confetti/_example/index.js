const TASKS = ['Write the docs', 'Draw the icons', 'Tell someone'];

const BURSTS = {
  ring: { spread: 360, velocity: 700, count: 90, shapes: ['dot', 'strip'] },
  streamers: { angle: 60, spread: 40, count: 50, shapes: ['curl'], drift: 120 },
  pink: { colors: ['bubblegum', 'tomato'], shapes: ['dot', 'star'], count: 60 },
};

Page({
  data: {
    tasks: TASKS.map((name, i) => ({ name, done: i < 2 })),
    status: '1 of 3 done',
    allDone: false,
  },
  onCelebrate() {
    const cf = this.selectComponent('#cf1');
    if (cf) cf.burst();
  },
  onPreset(e) {
    const cf = this.selectComponent('#cf2');
    const opts = BURSTS[e.currentTarget.dataset.burst];
    if (cf && opts) cf.burst(opts);
  },
  onTask(e) {
    const idx = Number(e.currentTarget.dataset.idx);
    const done = !!(e.detail && e.detail.checked);
    const tasks = this.data.tasks.map((t, i) => (i === idx ? { ...t, done } : t));
    const count = tasks.filter((t) => t.done).length;
    const all = count === tasks.length;
    this.setData({
      tasks,
      allDone: all,
      status: all ? 'All done. Go outside.' : `${count} of ${tasks.length} done`,
    });
  },
  onDone() {},
});
