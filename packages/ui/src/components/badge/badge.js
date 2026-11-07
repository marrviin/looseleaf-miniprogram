import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { tallyWidth } from '../../common/ink-engine';
import { props } from './props';

// Badge labels are set in the upstream hand font (Kevin Sans).
ensureHandFont();

const BADGE_H = { sm: 20, default: 24, lg: 28 }; // upstream px heights per size
const TALLY_MAX = 20; // upstream: counts above 20 never render as tally marks

createComponent({
  options: {
    styleIsolation: 'isolated',
    // No host node: the inner .ll-badge view is the layout box.
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'badge',
    countMode: false, // a count is set (digits or tally)
    tallied: false,
    shown: '',
    tallyStyle: '',
  },
  lifetimes: {
    attached() {
      // Extra recipe params for common/ink.js (merged in __renderInk).
      this.__inkParams = () => ({
        tone: this.data.tone,
        tally: this.data.tallied ? this.data.count : undefined,
        hoverable: this.data.hoverable,
      });
      this.__updateDerived();
    },
  },
  observers: {
    'variant, size, tone, count, max, tally, hoverable'() {
      this.__inkParams = () => ({
        tone: this.data.tone,
        tally: this.data.tallied ? this.data.count : undefined,
        hoverable: this.data.hoverable,
      });
      this.__updateDerived();
      // Defer one frame: count/tally change the box width, and the ink must be
      // drawn at the *new* measured size, not the layout being replaced.
      setTimeout(() => this.__measureInk(), 60);
    },
  },
  methods: {
    /** Recompute count display + the tally bar width (upstream badge.tsx). */
    __updateDerived() {
      const d = this.data;
      const hasCount = d.count !== null && d.count !== undefined && d.count !== '';
      const tallied = !hasCount ? false : d.tally && d.count > 0 && d.count <= TALLY_MAX;
      const shown = !hasCount
        ? ''
        : d.count > d.max
          ? `${d.max}+`
          : String(d.count);
      // Upstream sizes the tally span via tallyWidth(count, BADGE_H[size]); px -> rpx x2.
      const tallyStyle = tallied ? `width:${tallyWidth(d.count, BADGE_H[d.size] ?? 24) * 2}rpx` : '';
      this.setData({ countMode: hasCount, tallied, shown, tallyStyle });
    },
  },
});
