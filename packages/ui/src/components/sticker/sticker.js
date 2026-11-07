import { createComponent } from '../../common/component';
import { stickers, renderSticker } from '../../common/ink-engine';
import { svgDataUri, hashSeed } from '../../common/ink';
import { props } from './props';

/** Upstream autoTilt — ((hash % 640) - 320) / 100 deg, i.e. +-3.2. */
const autoTilt = (seed) => ((hashSeed(seed) % 640) - 320) / 100;

const blank = (v) => v === '' || v === undefined || v === null || v === false;

/** Upstream `Sticker` — intrinsic art at its own px size (the die-cut
    pipeline: white border, cut line, optional peeled corner). An svg that
    ignores the pointer; decorative unless `label` names it. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    has: false,
    wpx: 0,
    hpx: 0,
    deg: 0,
    artStyle: '',
  },
  lifetimes: {
    attached() {
      this.__draw();
    },
  },
  observers: {
    'name, size, peel, rotate, border, seed'() {
      this.__draw();
    },
  },
  methods: {
    __draw() {
      const d = this.data;
      const def = stickers[d.name];
      if (!def) {
        this.setData({ has: false, artStyle: '', wpx: 0, hpx: 0 });
        return;
      }
      const px = Math.max(32, Math.round(Number(d.size) || 96));
      const s = String(d.seed ?? '') || d.name;
      const peel = blank(d.peel) ? undefined : d.peel === 'true' ? true : d.peel;
      const border = blank(d.border) ? undefined : Math.round(Number(d.border));
      // idPrefix is per-svg document; data URIs are isolated, so a fixed
      // prefix cannot collide.
      const res = renderSticker(def, px, s, { peel, border, idPrefix: 'll-sticker' });
      const rotate = d.rotate;
      const deg =
        rotate === 'auto' || blank(rotate) ? autoTilt(s) : Number(rotate) || 0;
      this.setData({
        has: true,
        wpx: res.w,
        hpx: res.h,
        deg,
        artStyle: `inset:${-res.pad}px;background-image:url("${svgDataUri(res.svg, res)}");`,
      });
    },
  },
});
