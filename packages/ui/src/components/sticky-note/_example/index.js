Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    pads: [
      { color: 'yellow', title: 'todo', body: 'buy more ink' },
      { color: 'green', title: 'done', body: 'book the venue' },
      { color: 'orange', title: 'careful', body: 'the glue is wet' },
      { color: 'pink', title: 'urgent', body: 'call mum' },
      { color: 'blue', title: 'tip', body: 'tape it down first' },
    ],
    liveDone: false,
    board: [
      { id: 'a', color: 'yellow', title: 'design', body: 'finish the hero art', who: 'Ada', done: true },
      { id: 'b', color: 'green', title: 'docs', body: 'write the install page', who: 'Lin', done: false },
      { id: 'c', color: 'pink', title: 'ship', body: 'tag the release', who: 'Sam', done: false },
      { id: 'd', color: 'blue', title: 'later', body: 'ask about dark mode', who: 'Ada', done: false },
    ],
  },
  methods: {
    onLiveDone(e) {
      this.setData({ liveDone: e.detail.done });
    },
    onBoardDone(e) {
      // data-id rides the event's currentTarget (the note is inside a wx:for)
      const id = e.currentTarget.dataset.id;
      const board = this.data.board.map((n) => (n.id === id ? { ...n, done: e.detail.done } : n));
      this.setData({ board });
      return { id, done: e.detail.done };
    },
    /** Verification hook: press a board note's tick box. */
    tickBoard(id, _done) {
      const note = this.selectComponent(`#note-${id}`);
      if (!note) return { ok: false };
      note.toggleDone();
      return { ok: true };
    },
  },
});
