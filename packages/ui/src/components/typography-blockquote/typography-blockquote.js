import { createComponent } from '../../common/component';
import { props } from './props';
import { hashSeed } from '../../common/ink';
import { TYPOGRAPHY_QUOTE_BAR } from '../../common/typography-tiles';

/** Upstream typography Blockquote — script text behind a torn marker bar
    (an SVG mask over an 8px strip; -webkit-mask-image is the one mask the
    webview honours). The bar is one of three tile variants, picked by the
    seed. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    barCss: '',
  },
  observers: {
    seed(s) {
      this.__applySeed(s);
    },
  },
  lifetimes: {
    attached() {
      if (!this.data.barCss) this.__applySeed(this.data.seed);
    },
  },
  methods: {
    __applySeed(s) {
      const tile = TYPOGRAPHY_QUOTE_BAR[hashSeed(`${s}`) % 3];
      this.setData({
        barCss: `-webkit-mask-image:url("${tile.replace(/"/g, '&quot;')}");-webkit-mask-size:100% 100%;-webkit-mask-repeat:no-repeat;`,
      });
    },
  },
});
