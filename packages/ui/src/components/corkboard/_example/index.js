const TASKS = [
  { id: 'design', text: 'Design the header', stock: 'sticky-yellow', x: 12, y: 24 },
  { id: 'review', text: 'Review the PR', stock: 'sticky-blue', x: 180, y: 44 },
  { id: 'ship', text: 'Ship it (Friday)', stock: 'sticky-green', x: 50, y: 190 },
  { id: 'bugs', text: 'Squash the 3 bugs', stock: 'sticky-pink', x: 180, y: 200 },
];

Page({
  data: {
    tasks: TASKS,
    layout: {},
    layoutText: '{}',
  },
  onLayout(e) {
    const text = JSON.stringify(e.detail.value || {});
    this.setData({ layout: e.detail.value || {}, layoutText: text });
  },
  resetLayout() {
    this.setData({ layout: {}, layoutText: '{}' });
  },
});
