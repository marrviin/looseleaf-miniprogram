Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    month: 'Sep', // Controlled
    months: ['Sep', 'Oct', 'Nov'],
    said: '',
    tasks: [
      { label: 'Ink the outline', done: true },
      { label: 'Wash the sky', done: true },
      { label: 'Hatch the shade', done: false },
      { label: 'Sign it', done: false },
    ], // Project files
  },
  methods: {
    onMonthChange(e) {
      this.setData({ month: e.detail.value });
    },
    nextMonth() {
      const { months, month } = this.data;
      const next = months[(months.indexOf(month) + 1) % months.length];
      this.setData({ month: next, said: next });
    },
    onTask(e) {
      const i = Number(e.currentTarget.dataset.index);
      const key = `tasks[${i}].done`;
      this.setData({ [key]: !this.data.tasks[i].done });
    },
    addTask() {
      const n = this.data.tasks.length + 1;
      this.setData({ tasks: [...this.data.tasks, { label: `Task ${n}`, done: false }] });
    },
  },
});
