import { createComponent } from '../../common/component';
import { barcode } from '../../common/ink-engine';
import { props } from './props';

/** Upstream `ReceiptBarcode` — bars seeded from the number under them.
    Upstream stretches a 220×h viewBox to the full width
    (preserveAspectRatio="none"); svgDataUri can't do that, so the data URI
    is built here with preserveAspectRatio="none" baked in. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    uri: '',
    barH: 77,
  },
  lifetimes: {
    attached() {
      this.__update();
    },
  },
  observers: {
    'value, height'() {
      this.__update();
    },
  },
  methods: {
    __update() {
      const d = this.data;
      const h = Math.max(8, Number(d.height) || 44);
      const { d: pathD } = barcode(d.value, 220, h);
      const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 ${h}" ` +
        `preserveAspectRatio="none" focusable="false">` +
        `<path d="${pathD}" fill="#2a2420"/></svg>`;
      this.setData({
        uri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
        barH: Math.round(h * 1.76), /* upstream px -> rpx */
      });
    },
  },
});
