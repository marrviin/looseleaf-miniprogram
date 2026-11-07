import { createComponent } from '../../common/component';
import { props, validators } from './props';
import { itemFrameVars } from '../../common/item-frames';
import { hashSeed } from '../../common/ink';

/** Upstream `ItemMedia`. Parity (which photo leans which way) and the
    translate when the row carries a description come from the parent Item
    over the relation — cross-component selectors don't exist here. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    v: 'default',
    idx: 0,
    hasDesc: false,
    rootStyle: '',
  },
  observers: {
    variant(variant) {
      this.setData({ v: validators.variant.includes(variant) ? variant : 'default' });
      this.__draw();
    },
    seed() {
      this.__draw();
    },
  },
  lifetimes: {
    attached() {
      this.setData({
        v: validators.variant.includes(this.data.variant) ? this.data.variant : 'default',
      });
      this.__draw();
    },
  },
  methods: {
    __draw() {
      // Only the icon well draws a ruled box; the photo and bare media don't.
      if (this.data.v !== 'icon') return;
      const d = this.data;
      const key = d.seed === '' || d.seed === null || d.seed === undefined ? `item|${this.__wxWebviewId__ ?? 0}` : String(d.seed);
      this.setData({ rootStyle: itemFrameVars(hashSeed(key) % 3) });
    },
    /** Called by the parent Item: sibling index + description presence. */
    __onItem({ index, hasDesc }) {
      this.setData({ idx: index, hasDesc: !!hasDesc });
    },
  },
});
