import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `ReceiptTotal` — the bold line; `circled` draws a felt-tip loop
    around the amount (recipe receipt-circle, pad 14 — the ink layer overhangs
    the dd). Upstream keeps the amount in ordinary DOM; only the loop is ink. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    circledOn: false,
    llInkRecipe: '',
    llInkSelector: '.ll-receipt-total-ink',
  },
  lifetimes: {
    attached() {
      this.__update();
    },
  },
  observers: {
    'circled, seed'() {
      this.__update();
    },
  },
  methods: {
    __update() {
      const d = this.data;
      const raw = d.circled;
      const on = raw === true || raw === 'red' || raw === 'blue' || raw === 'ink';
      const pen = raw === 'blue' ? 'blue' : raw === 'ink' ? 'ink' : 'redfelt';
      if (on) {
        // Params first, then the recipe id (attachInk reads both on measure).
        this.__inkParams = { pen };
        this.setData({ circledOn: true, llInkRecipe: 'receipt-circle' });
        this.__measureInk();
      } else {
        this.setData({ circledOn: false, llInkRecipe: '', inkStyle: '' });
      }
    },
  },
});
