import { createComponent } from '../../common/component';
import { BUTTON_GROUP_CHILD_RELATION, buttonGroupChildBehavior } from '../../common/button-group-child';
import { props } from './props';

/** Upstream `ButtonGroupText` — a printed cell in the row ("https://", "@",
    "kg"): a paper-shade body under an ink box, real text in the hand font.
    Not a control: it has no hover or focus. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  behaviors: [buttonGroupChildBehavior('.ll-button-group-text')],
  properties: props,
  relations: {
    '../button-group/button-group': BUTTON_GROUP_CHILD_RELATION,
  },
  data: {
    llInkRecipe: 'button-group-text',
    llInkSelector: '.ll-button-group-text',
  },
  observers: {
    seed() {
      setTimeout(() => this.__renderInk(), 0);
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({});
      if (this.data.seed) this.__inkSeed = String(this.data.seed);
    },
  },
});
