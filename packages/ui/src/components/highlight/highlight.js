import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { attachMark } from '../../common/mark';
import { props } from './props';

ensureHandFont();

const FAT = { light: 0.82, regular: 1, heavy: 1.22 }; // upstream FAT

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  behaviors: [attachMark()],
  properties: props,
  lifetimes: {
    created() {
      // Per-line highlighter swipes behind the text (upstream useMarkInk
      // kind 'highlight', no over — the swipe sits under the words).
      this.__markConfig = {
        recipe: 'highlight',
        mode: 'lines',
        over: false,
        params: (d) => ({ tone: d.tone, fat: FAT[d.weight] ?? 1, cover: d.cover }),
      };
    },
  },
});
