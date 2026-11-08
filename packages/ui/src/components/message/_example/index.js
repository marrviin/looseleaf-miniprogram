const REPLY =
  'Tags now sit under each note as small chips. Pick one or two and the list narrows. I kept the count at the top honest, so it always shows what is left.';
const WORDS = REPLY.split(' ');

Page({
  data: {
    count: 0,
    streaming: false,
    streamText: '',
  },
  onUnload() {
    if (this.__timer) clearInterval(this.__timer);
  },
  replay() {
    if (this.__timer) clearInterval(this.__timer);
    this.setData({ count: 0, streaming: true, streamText: '' });
    this.__timer = setInterval(() => {
      const c = Math.min(this.data.count + 1, WORDS.length);
      this.setData({ count: c, streamText: WORDS.slice(0, c).join(' ') });
      if (c >= WORDS.length) {
        clearInterval(this.__timer);
        this.setData({ streaming: false });
      }
    }, 140);
  },
});
