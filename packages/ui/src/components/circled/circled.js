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
      // Upstream useMarkInk kind 'circled': one loop around the whole
      // phrase (box mode), drawn in front of the words (over).
      this.__markConfig = {
        recipe: 'circled',
        mode: 'box',
        over: true,
        params: (d) => ({ shape: d.shape, tone: d.tone, weight: d.weight, bleed: d.bleed }),
      };
    },
  },
});
