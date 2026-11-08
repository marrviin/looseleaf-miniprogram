import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream inline `Tick` — the carouselTickRecipe draws a pencil dash
    (checked: blue) or the group-slash. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'carousel-tick',
    llInkSelector: '.ll-carousel-dot',
    checked: false,
  },
  observers: {
    'selected, slash, index, seed'(selected, slash, index, seed) {
      this.__inkParams = { slash, pitch: 24 };
      this.setData({ checked: selected });
      setTimeout(() => this.__measureInk && this.__measureInk(), 0);
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = { slash: this.data.slash, pitch: 24 };
    },
  },
  methods: {
    onTap() {
      this.triggerEvent('tap', { index: this.data.index });
    },
  },
});
