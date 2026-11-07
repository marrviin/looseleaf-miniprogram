import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { props } from './props';

ensureHandFont();

/** Upstream `Rule` — one hand-drawn rule (the separator recipe). The host is a
    1px hairline (h-px w-full / w-px h-full) and the drawing spills up to 12px
    across it via the ink layer's negative inset. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'separator',
    // recipe id is 'separator'; the root class is .ll-rule
    llInkSelector: '.ll-rule',
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({ orientation: this.data.orientation });
    },
  },
  observers: {
    'variant, orientation'() {
      this.__inkParams = () => ({ orientation: this.data.orientation });
      setTimeout(() => this.__measureInk(), 60);
    },
  },
});
