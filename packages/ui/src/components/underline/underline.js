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
      // Upstream useMarkInk kind 'underline': one line per text line, drawn
      // under the words (over defaults off).
      this.__markConfig = {
        recipe: 'underline',
        mode: 'lines',
        over: false,
        params: (d) => ({ kind: d.kind, tone: d.tone, weight: d.weight }),
      };
    },
  },
});
