const LINES = [
  { you: false, say: 'The tags branch is ready for you.' },
  { you: true, say: 'Already pulled it. Reading now.' },
  { you: false, say: 'Chips sit above the list, small and quiet.' },
  { you: true, say: 'Good. And the count?' },
  { you: false, say: 'The count stays at the top, honest as ever.' },
  { you: true, say: 'What about empty tags?' },
  { you: false, say: 'An empty tag cannot be saved. The chip just refuses.' },
  { you: true, say: 'Refuses how?' },
  { you: false, say: 'It shakes once, like a wet dog.' },
  { you: true, say: 'Perfect. Ship it.' },
  { you: false, say: 'One more thing: the filter row.' },
  { you: false, say: 'But that can wait until Monday.' },
];

const THREAD = [
  { id: 'intro', you: false, say: 'Morning. Here is the plan for the notes page.' },
  { id: 'tags', you: false, say: 'Tags now sit under each note as small chips. Pick one or two and the list narrows.' },
  { id: 'count', you: true, say: 'And the count at the top?' },
  { id: 'honest', you: false, say: 'Honest. It always shows what is left, never what was there.' },
  { id: 'end', you: true, say: 'Then I will start with the chips.' },
  { id: 'chips', you: false, say: 'The chips keep their corners round and fade out politely when you remove them.' },
  { id: 'narrow', you: true, say: 'And the list narrows as I pick?' },
  { id: 'pick', you: false, say: 'Pick one or two. The count follows without being asked.' },
  { id: 'monday', you: true, say: 'Good. The filter row can wait until Monday.' },
  { id: 'agree', you: false, say: 'Monday it is. Bring the good umbrella.' },
];

const REPLY =
  'I wrote the chips this morning while the kettle boiled. They are small, they keep their corners round, and they fade out politely when you remove them. The list narrows as you pick, and the count follows without being asked.';

Page({
  data: {
    lines: LINES,
    thread: THREAD,
    pinId: '',
    streamSay: '',
    streaming: false,
  },
  addLine() {
    const lines = this.data.lines.concat({
      you: !this.data.lines[this.data.lines.length - 1].you,
      say: 'One more line, right on time.',
    });
    this.setData({ lines });
  },
  stream() {
    if (this.__timer) clearInterval(this.__timer);
    const words = REPLY.split(' ');
    let n = 0;
    this.setData({ streamSay: '', streaming: true });
    this.__timer = setInterval(() => {
      n += 1;
      this.setData({ streamSay: words.slice(0, n).join(' ') });
      if (n >= words.length) {
        clearInterval(this.__timer);
        this.setData({ streaming: false });
      }
    }, 120);
  },
  pinTag() {
    this.setData({ pinId: '' });
    setTimeout(() => this.setData({ pinId: 'tags' }), 60);
  },
  onUnload() {
    if (this.__timer) clearInterval(this.__timer);
  },
});
