import { createComponent } from '../../common/component';
import { stamp, badgesStamps } from '../../common/ink-engine';
import { svgDataUri } from '../../common/ink';
import { props, validators } from './props';

const blank = (v) => v === '' || v === undefined || v === null || v === false;

/** Upstream `Stamp` — the rubber-stamp generator (art/rubber-stamp), drawn
    once per (text, shape, opts) at its own pixel size. An svg that ignores
    the pointer and keeps its name for screen readers; a preset name fills
    every unset prop from the sticker library. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    wpx: 0,
    hpx: 0,
    has: false,
    artStyle: '',
  },
  lifetimes: {
    attached() {
      this.__draw();
    },
  },
  observers: {
    'name, text, shape, ink, sub, ring, w, h, size, tilt, ghost, dashed, seed'() {
      this.__draw();
    },
  },
  methods: {
    __draw() {
      const d = this.data;
      const preset =
        d.name && badgesStamps[d.name] && badgesStamps[d.name].gen === 'stamp'
          ? badgesStamps[d.name]
          : undefined;
      const t = d.text || (preset && preset.text);
      if (!t) {
        this.setData({ has: false, artStyle: '', wpx: 0, hpx: 0 });
        return;
      }
      const sh = validators.shape.includes(d.shape) ? d.shape : (preset && preset.shape) || 'rect';
      const num = (v) => (blank(v) ? undefined : Math.round(Number(v)));
      const opts = {
        ink: validators.ink.includes(d.ink) ? d.ink : preset && preset.ink,
        sub: blank(d.sub) ? preset && preset.sub : d.sub,
        ring: blank(d.ring) ? preset && preset.ring : d.ring,
        w: num(d.size) || num(d.w) || (preset && preset.w),
        h: num(d.size) || num(d.h) || (preset && preset.h),
        tilt: blank(d.tilt) ? preset && preset.tilt : Number(d.tilt),
        ghost: blank(d.ghost) ? undefined : true,
        dashed: blank(d.dashed) ? undefined : true,
        stars: preset && preset.stars,
        wear: preset && preset.wear,
        seed: d.seed || d.name || t,
      };
      const res = stamp(t, sh, opts);
      this.setData({
        has: true,
        wpx: res.w,
        hpx: res.h,
        artStyle: `inset:${-res.pad}px;background-image:url("${svgDataUri(res.svg, res)}");`,
      });
    },
  },
});
