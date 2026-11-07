import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { props, validators } from './props';

ensureHandFont();

/** Upstream RIBBON_SIZES + ribbonGutter/ribbonInset/ribbonDrop
    (ribbon-ink.ts) — the layout box the recipe measures and draws into. */
const SIZES = {
  sm: { band: 26, tail: 14, drop: 6, font: 25 }, // 14px x .88 -> 25rpx
  default: { band: 34, tail: 20, drop: 9, font: 28 }, // 16px x .88
  lg: { band: 46, tail: 28, drop: 12, font: 35 }, // 20px x .88
};
const gutter = (variant) => (variant === 'flag' ? 12 : 14);
const inset = (variant, size) =>
  variant === 'banner' ? SIZES[size].tail : Math.round(SIZES[size].band * 0.32);
const drop = (variant, size) => (variant === 'banner' ? SIZES[size].drop : 0);

/** Upstream `Ribbon` — a band of colored paper drawn behind its words
    (ribbon recipe: felt-tip band fill, folded tails / notched ends), a
    font-hand bold label that never wraps. Interactive ribbons (upstream
    asChild/onClick/href) show the drawn hover layer — underline + drop-line
    — and lift 1px (a mouse-only affordance; here driven by `hovered`). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'ribbon',
    llInkSelector: '.ll-ribbon',
    ribbonStyle: '',
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({
        tone: this.data.tone,
        hoverable: !!this.data.interactive,
      });
      this.__updateRibbon();
    },
  },
  observers: {
    'variant, tone, size, interactive'() {
      this.__inkParams = () => ({
        tone: this.data.tone,
        hoverable: !!this.data.interactive,
      });
      this.__updateRibbon();
      // hoverable flips recipe params: re-measure after the box settles.
      setTimeout(() => this.__measureInk(), 60);
    },
  },
  methods: {
    __updateRibbon() {
      const d = this.data;
      const variant = validators.variant.includes(d.variant) ? d.variant : 'banner';
      const size = validators.size.includes(d.size) ? d.size : 'default';
      const S = SIZES[size];
      const ins = inset(variant, size);
      const dr = drop(variant, size);
      // height: band + drop; paddingInline: inset + gutter; paddingBottom: drop
      // (drops the words into the band above the tails); minWidth: 2*inset + 24.
      const style =
        `height:${(S.band + dr) * 2}rpx;` +
        `padding:0 ${(ins + gutter(variant)) * 2}rpx ${dr * 2}rpx;` +
        `min-width:${(2 * ins + 24) * 2}rpx;`;
      this.setData({ ribbonStyle: style });
    },
    onTap() {
      this.triggerEvent('tap', { variant: this.data.variant, tone: this.data.tone });
    },
  },
});
