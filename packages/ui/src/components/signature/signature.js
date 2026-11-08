import { createComponent } from '../../common/component';
import { RECIPES, runRecipe } from '../../common/ink-engine';
import { svgDataUri, hashSeed } from '../../common/ink';
import { onHandFontReady } from '../../common/hand-font';
import { props } from './props';

/** Upstream `Signature` — the name in the script font with the flourish
    (signatureRecipe) drawn under it. The name is slotted text; the
    flourish is one absolute SVG layer over the host box, measured like
    the mark behavior (mark.js) but a single rect — upstream measures the
    host span once. `animate` replays the signing with CSS wipes (the
    upstream SVG reveal runs SMIL, which a background-image can't rely
    on): name first, flourish ~0.7s later, `delay` shifts both. */

const SIZE = { sm: 28, md: 44, lg: 64 };
const RUN_REQ = { tier: 'lo', density: 'comfortable', knobs: { wobble: 1, misreg: 1, bleed: 1, width: 1 }, dir: 'ltr' };

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    inkStyle: '',
    nameStyle: '',
  },
  observers: {
    'flourish, size, tone, weight, show, seed'() {
      this.__measure();
    },
  },
  lifetimes: {
    attached() {
      this.__retries = 0;
      onHandFontReady(() => {
        if (this.__detached) return;
        setTimeout(() => this.__measure(), 50);
      });
    },
    ready() {
      this.__measure();
    },
    detached() {
      this.__detached = true;
    },
  },
  methods: {
    __measure() {
      const d = this.data;
      if (!d.show || d.flourish === 'none') {
        this.setData({ inkStyle: '' });
        return;
      }
      const query = this.createSelectorQuery();
      query.select('.ll-signature').boundingClientRect();
      query.select('.ll-signature__name').fields({ computedStyle: ['font-size'] });
      query.exec((res) => {
        if (this.__detached) return;
        const host = res[0];
        const fs = res[1] ? parseFloat(res[1]['font-size']) || SIZE[d.size] : SIZE[d.size];
        if (!host || !host.width || !host.height) {
          // Not laid out yet — same retry ladder as the mark behavior.
          const n = ++this.__retries;
          if (n < 300) setTimeout(() => this.__measure(), n <= 20 ? 50 : n <= 60 ? 250 : 1000);
          return;
        }
        this.__retries = 0;
        this.__render(host, fs);
      });
    },
    __render(host, fs) {
      const d = this.data;
      const recipe = RECIPES['signature'];
      if (!recipe) return;
      const frame = runRecipe(
        recipe,
        {
          ...RUN_REQ,
          box: { w: host.width, h: host.height },
          params: { flourish: d.flourish, tone: d.tone, weight: d.weight, fs, animate: false },
          seed: `${hashSeed(`signature:${d.seed ?? ''}`)}`,
          lazy: [],
        }
      );
      // The flourish spills pad px beyond the host box.
      const style =
        `left:${-frame.pad}px;top:${-frame.pad}px;` +
        `width:${host.width + frame.pad * 2}px;height:${host.height + frame.pad * 2}px;` +
        `background-image:url("${svgDataUri(frame.parts.rest, frame)}");` +
        (d.animate ? `-webkit-animation:ll-sig-wipe 0.9s ease-out ${Number(d.delay) + 700}ms both;animation:ll-sig-wipe 0.9s ease-out ${Number(d.delay) + 700}ms both;` : '');
      this.setData({
        inkStyle: style,
        nameStyle: d.animate
          ? `-webkit-animation:ll-sig-wipe 1.2s ease-out ${Number(d.delay)}ms both;animation:ll-sig-wipe 1.2s ease-out ${Number(d.delay)}ms both;`
          : '',
      });
    },
  },
});
