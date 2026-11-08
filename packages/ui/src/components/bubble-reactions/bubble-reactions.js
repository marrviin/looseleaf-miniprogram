import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `BubbleReactions` — white vinyl chip with a cut line, absolutely
    positioned over the bubble's edge. Emoji, counts or small buttons slot in. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'bubble-reactions',
    llInkSelector: '.ll-bubble-reactions',
  },
  observers: {
    dashed() {
      this.__inkParams = { dashed: !!this.data.dashed };
      setTimeout(() => this.__measureInk && this.__measureInk(), 0);
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = { dashed: !!this.data.dashed };
    },
  },
});
