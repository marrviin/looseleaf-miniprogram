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
      // Upstream useMarkInk kind 'scribble': one scribble per text line,
      // drawn in front of the words (over).
      this.__markConfig = {
        recipe: 'scribble',
        mode: 'lines',
        over: true,
        params: (d) => ({ tone: d.tone, weight: d.weight }),
      };
    },
  },
});
