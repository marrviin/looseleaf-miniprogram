import { createComponent } from '../../common/component';
import { props, validators } from './props';
import { itemFrameVars } from '../../common/item-frames';
import { hashSeed } from '../../common/ink';

/** Upstream `ItemSeparator` — the default pencil line between rows is drawn
    by the same stylesheet as the rows (a mask, no svg); any other variant is
    a real Separator (rendered as ll-separator, `my-0`). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    plain: true, // pencil + horizontal → the CSS-mask line
    v: 'pencil',
    rootStyle: '',
  },
  observers: {
    'variant, orientation'(variant, orientation) {
      const val = (list, x) => (list.includes(x) ? x : list[0]);
      const v = val(validators.variant, variant);
      const o = val(validators.orientation, orientation);
      this.setData({ v, plain: v === 'pencil' && o === 'horizontal' });
    },
    seed() {
      this.__draw();
    },
  },
  lifetimes: {
    attached() {
      const d = this.data;
      const v = validators.variant.includes(d.variant) ? d.variant : 'pencil';
      const o = validators.orientation.includes(d.orientation) ? d.orientation : 'horizontal';
      this.setData({ v, plain: v === 'pencil' && o === 'horizontal' });
      this.__draw();
    },
  },
  methods: {
    __draw() {
      const d = this.data;
      const key = d.seed === '' || d.seed === null || d.seed === undefined ? `item|${this.__wxWebviewId__ ?? 0}` : String(d.seed);
      this.setData({ rootStyle: itemFrameVars(hashSeed(key) % 3) });
    },
  },
});
