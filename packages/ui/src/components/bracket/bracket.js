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
    llInkRecipe: 'bracket',
    llInkSelector: '.ll-bracket',
  },
  observers: {
    'kind, side, tone, weight, inset, seed'() {
      this.__inkParams = () => ({
        kind: this.data.kind,
        side: this.data.side,
        tone: this.data.tone,
        weight: this.data.weight,
        inset: this.data.inset,
        animate: toBool(this.data.animate),
      });
      this.__measureInk();
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({
        kind: this.data.kind,
        side: this.data.side,
        tone: this.data.tone,
        weight: this.data.weight,
        inset: this.data.inset,
        animate: toBool(this.data.animate),
      });
    },
  },
});
