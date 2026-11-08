import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { labelStar } from '../../common/ink-engine';
import { resolvePaint, svgDataUri } from '../../common/ink';
import TOKENS from '../../common/tokens';
import { props } from './props';

// Labels are set in the upstream hand font (Kevin Sans); loading is
// idempotent and silently degrades to the system font.
ensureHandFont();

createComponent({
  options: {
    styleIsolation: 'isolated',
    // No host node: the native <label> is the layout box.
    virtualHost: true,
  },
  properties: props,
  data: {
    starStyle: '',
  },
  observers: {
    'required, seed'() {
      this.__drawStar();
    },
  },
  lifetimes: {
    attached() {
      // Upstream seeds the star from useId() — one drawn hand per label.
      this.__starSeed = this.data.seed === '' ? String(Math.floor(Math.random() * 1e9)) : String(this.data.seed);
      this.__drawStar();
    },
  },
  methods: {
    /** The required star is a fixed-size drawn icon (drawSkeleton, tone 'ui')
        — no recipe pipeline. The skeleton paints with currentColor; resolve
        it to the red token before inlining (a data URI can't see CSS vars). */
    __drawStar() {
      if (!this.data.required) return;
      const res = labelStar(this.__starSeed);
      const svg = resolvePaint(res.svg, TOKENS['--ll-red']);
      this.setData({ starStyle: `background-image:url("${svgDataUri(svg, res)}")` });
    },
  },
});
