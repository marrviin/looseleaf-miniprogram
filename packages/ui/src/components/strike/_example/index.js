// ll-strike demo — mirrors the upstream docs page (#/components/strike).
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 04-todo: tick a box, the task is struck through in red pencil.
    tasks: ['Buy oat milk', 'Book the train', 'Reply to Sam', 'Water the ferns'],
    done: { 'Buy oat milk': true },
  },
  methods: {
    onToggle(e) {
      const task = e.currentTarget.dataset.task;
      const value = e.detail.value;
      this.setData({ [`done.${task}`]: !!value });
    },
  },
});
