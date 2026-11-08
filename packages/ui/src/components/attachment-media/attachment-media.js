import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `AttachmentMedia` — the square tile at the slip's left (icon
    over a wash blob) or the photo area of the vertical print. The recipe
    washes a red blob on error. State arrives from the root relation. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    state: 'done',
    llInkRecipe: 'attachment-media',
    llInkSelector: '.ll-attachment-media',
  },
  observers: {
    'variant, seed'() {
      this.__apply();
    },
  },
  relations: {
    '../attachment/attachment': { type: 'ancestor' },
  },
  lifetimes: {
    attached() {
      this.__apply();
    },
  },
  methods: {
    __apply() {
      this.__inkParams = { state: this.data.state, variant: this.data.variant || 'icon' };
      setTimeout(() => this.__measureInk && this.__measureInk(), 0);
    },
    __onAttachment({ state }) {
      if (state === this.data.state) return;
      this.setData({ state });
      this.__apply();
    },
  },
});
