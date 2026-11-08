import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { labelStar } from '../../common/ink-engine';
import { resolvePaint, svgDataUri } from '../../common/ink';
import TOKENS from '../../common/tokens';
import { props } from './props';

ensureHandFont();

/** ll-field-label — upstream FieldLabel (a Label): the bold hand words for
    a field, or — with `card` — a hand-drawn choice card wrapping a whole
    Field (field-choice ink: rest sketch, hover wash, checked highlighter;
    `checked` is a controlled prop because state can't cross slots). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    starStyle: '',
  },
  observers: {
    card(card) {
      // ink only in card mode; attachInk skips measuring without a recipe
      this.setData({ llInkRecipe: card ? 'field-choice' : '' });
    },
    checked() {
      // checked card: stack the highlighter wash + felt box over rest
      if (typeof this.__applyInkLayer === 'function') this.__applyInkLayer();
    },
    'required, seed'() {
      this.__drawStar();
    },
  },
  lifetimes: {
    attached() {
      if (this.data.card) this.setData({ llInkRecipe: 'field-choice', llInkSelector: '.ll-field-label' });
      this.__starSeed = this.data.seed === '' ? String(Math.floor(Math.random() * 1e9)) : String(this.data.seed);
      this.__drawStar();
    },
  },
  methods: {
    onTap() {
      this.triggerEvent('tap', { checked: this.data.checked });
    },
    __drawStar() {
      if (!this.data.required) return;
      const res = labelStar(this.__starSeed);
      const svg = resolvePaint(res.svg, TOKENS['--ll-red']);
      this.setData({ starStyle: `background-image:url("${svgDataUri(svg, res)}")` });
    },
  },
});
