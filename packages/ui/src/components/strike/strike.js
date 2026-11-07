import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { attachMark } from '../../common/mark';
import { props } from './props';

ensureHandFont();

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  behaviors: [attachMark()],
  properties: props,
  lifetimes: {
    created() {
      // Upstream useMarkInk kind 'strike': one line per text line, but a
      // cross-out is a single X over the whole phrase (box mode), and the
      // drawing sits in front of the words (over).
      this.__markConfig = {
        recipe: 'strike',
        mode: (d) => (d.kind === 'cross' ? 'box' : 'lines'),
        over: true,
        params: (d) => ({ kind: d.kind, tone: d.tone, weight: d.weight }),
      };
    },
  },
});
