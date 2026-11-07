import { createComponent } from '../../common/component';
import { props } from './props';

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
    // Named slot "action" next to the default slot.
    multipleSlots: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'card-rule',
    // The recipe id is 'card-rule' but the ink host is this header root.
    llInkSelector: '.ll-card-header',
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({ edge: 'bottom', style: this.data.rule });
    },
  },
  observers: {
    rule() {
      this.__inkParams = () => ({ edge: 'bottom', style: this.data.rule });
      setTimeout(() => this.__measureInk(), 60);
    },
  },
});
