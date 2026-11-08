import { createComponent } from '../../common/component';
import { stepperTallyWidth, stepperTallyH } from '../../common/ink-engine';
import { props } from './props';

/** Upstream `StepperTally` — the value as tally marks (four strokes and a
    slash per group of five), a companion for a quantity you count on your
    fingers. Decorative (aria-hidden). Box sized by the recipe's metrics. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'stepper-tally',
    llInkSelector: '.ll-stepper-tally',
    w: 8,
    count: 0,
  },
  observers: {
    'value, max'() {
      this.__sync();
    },
    seed() {
      this.__sync();
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({ count: this.data.count });
      this.__sync();
      setTimeout(() => this.__measureInk(), 50);
      setTimeout(() => this.__measureInk(), 300);
    },
  },
  methods: {
    __sync() {
      const d = this.data;
      const shown = d.value != null && Number.isFinite(Number(d.value)) ? Number(d.value) : 0;
      const count = Math.max(0, Math.min(Math.floor(shown), Number(d.max) || 20));
      const w = stepperTallyWidth(Math.max(count, 1), stepperTallyH);
      this.setData({ count, w });
      this.__inkParams = () => ({ count });
      setTimeout(() => this.__measureInk(), 0);
    },
  },
});
