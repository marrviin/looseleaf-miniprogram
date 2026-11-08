import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `QuoteText` — the quoteRecipe draws four big quotation marks
    (two opening, two closing) round the script text. */
const SIZE = { sm: 24, md: 32, lg: 46 };
const PADDING = {
  sm: 'padding:4px 32px 4px 40px;',
  md: 'padding:6px 40px 6px 52px;',
  lg: 'padding:8px 56px 8px 76px;',
};

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'quote',
    llInkSelector: '.ll-quote-text',
    padStyle: PADDING.md,
  },
  observers: {
    'size, tone, weight, rule'(size, tone, weight, rule) {
      const s = SIZE[size] || SIZE.md;
      this.__inkParams = { tone, weight, size: s, rule, animate: false };
      this.setData({ padStyle: PADDING[size] || PADDING.md });
      setTimeout(() => {
        this.__measureInk && this.__measureInk();
      }, 0);
    },
  },
  lifetimes: {
    attached() {
      const { size, tone, weight, rule } = this.data;
      this.__inkParams = { tone, weight, size: SIZE[size] || SIZE.md, rule, animate: false };
    },
  },
});
