import { createComponent } from '../../common/component';
import { props } from './props';
import { drawMascot, mascot, mascotProps } from '../../common/ink-engine';
import { svgDataUri } from '../../common/ink';

const FRAMES = mascotProps.frames || {};

/** Upstream `Mascot` — drawMascot on the pose map (die-cut: white sticker
    border included, so `size` is the height of the whole sticker). One SVG
    per (pose, frame, size, tier, seed), drawn not scaled. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    px: 96,
    has: false,
    shadowed: true,
    artStyle: '',
  },
  lifetimes: {
    attached() {
      this.__draw();
    },
  },
  observers: {
    'pose, size, seed, frame, tier, shadow'() {
      this.__draw();
    },
  },
  methods: {
    __draw() {
      const d = this.data;
      const flip = d.frame !== '' && d.frame !== undefined && FRAMES[`${d.pose}-${d.frame}`];
      const def = flip || mascot[d.pose];
      if (!def) {
        this.setData({ has: false, artStyle: '' });
        return;
      }
      const px = Math.max(16, Math.round(Number(d.size) || 96));
      const res = drawMascot(def, px, String(d.seed || (flip ? `${d.pose}-${d.frame}` : d.pose)), {
        tier: d.tier === 'hi' ? 'hi' : 'lo',
        idPrefix: 'll-mascot',
      });
      this.setData({
        has: true,
        px: res.w, // the sticker's own box (border included) — like upstream svg width/height
        artStyle: `inset:${-res.pad}px;background-image:url("${svgDataUri(res.svg, res)}");`,
        shadowed: !(d.shadow === false || d.shadow === 'false'),
      });
    },
  },
});
