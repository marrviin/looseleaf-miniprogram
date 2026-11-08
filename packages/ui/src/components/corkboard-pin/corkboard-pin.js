import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Pin` (internal to Corkboard, its own component here so it gets
    its own ink recipe) — a 24×24 push pin; the recipe draws at a fixed size. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'corkboard-pin',
    llInkSelector: '.ll-corkboard-pin',
  },
  observers: {
    'color, seed'() {
      this.__inkParams = { color: this.data.color || 'tomato' };
      setTimeout(() => this.__measureInk && this.__measureInk(), 0);
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = { color: this.data.color || 'tomato' };
    },
  },
});
