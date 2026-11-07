import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { props } from './props';

// Button labels are set in the upstream hand font (Kevin Sans); loading is
// idempotent and silently degrades to the system font.
ensureHandFont();

createComponent({
  options: {
    // Ink layers are class-driven; component styles stay isolated from the page.
    styleIsolation: 'isolated',
    // No host node: the inner .ll-button view becomes the layout box, so
    // buttons shrink-wrap their content instead of stretching full-width.
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'button',
  },
  methods: {
    noop() {},
    onTap(e) {
      if (this.data.disabled || this.data.loading) return;
      this.triggerEvent('tap', e.detail);
    },
    onGetUserInfo(e) {
      this.triggerEvent('getuserinfo', e.detail);
    },
    onContact(e) {
      this.triggerEvent('contact', e.detail);
    },
    onError(e) {
      this.triggerEvent('error', e.detail);
    },
  },
});
