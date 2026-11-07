import { createComponent } from '../../common/component';
import { props } from './props';

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'card-rule',
    llInkSelector: '.ll-card-footer',
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({ edge: 'top', style: this.data.rule });
    },
  },
  observers: {
    rule() {
      this.__inkParams = () => ({ edge: 'top', style: this.data.rule });
      setTimeout(() => this.__measureInk(), 60);
    },
  },
});
