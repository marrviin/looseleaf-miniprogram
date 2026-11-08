import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `AspectRatio` — a box that keeps a fixed width/height ratio.
    The webview (Chromium <88) has no `aspect-ratio` property, so the ratio
    is laid out the old way: a spacer with percentage padding-top and the
    slot absolutely positioned over it. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    padTop: '100%',
  },
  observers: {
    ratio(v) {
      this.__applyRatio(v);
    },
  },
  lifetimes: {
    attached() {
      this.__applyRatio(this.data.ratio);
    },
  },
  methods: {
    __applyRatio(v) {
      const r = typeof v === 'string' ? parseFloat(v) : v;
      const pct = r > 0 ? (1 / r) * 100 : 100;
      const top = `${pct.toFixed(4)}%`;
      if (top !== this.data.padTop) this.setData({ padTop: top });
    },
  },
});
