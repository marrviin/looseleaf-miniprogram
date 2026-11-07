import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { attachInk } from '../../common/ink';
import { props } from './props';

ensureHandFont();

const toBool = (v) => v === true || v === 'true';

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  behaviors: [attachInk()],
  properties: props,
  data: {
    llInkRecipe: 'squiggle',
    llInkSelector: '.ll-squiggle',
  },
  observers: {
    'kind, orientation, tone, weight, seed'() {
      this.__inkParams = () => ({
        kind: this.data.kind,
        orientation: this.data.orientation,
        tone: this.data.tone,
        weight: this.data.weight,
        animate: toBool(this.data.animate),
      });
      this.__measureInk();
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({
        kind: this.data.kind,
        orientation: this.data.orientation,
        tone: this.data.tone,
        weight: this.data.weight,
        animate: toBool(this.data.animate),
      });
    },
  },
});
