import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-field-error — upstream FieldError: a red message (or list) wearing a
    wavy red pencil underline (field-error ink). Renders nothing when
    there is nothing to say. Announced as an alert (role="alert"). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'field-error',
    messages: [],
    listed: false,
    hasContent: false,
  },
  observers: {
    errors() {
      this.__applyErrors();
    },
  },
  lifetimes: {
    attached() {
      this.__applyErrors();
      // slot content counts too: an empty <slot> wrapper measures 0x0
      this.createSelectorQuery().select('.ll-field-error__slot').boundingClientRect((rect) => {
        const slotted = !!(rect && rect.width && rect.height);
        if (slotted !== !!this.data.slotted) {
          this.setData({ slotted, hasContent: slotted || this.data.messages.length > 0 });
        }
      }).exec();
    },
  },
  methods: {
    __applyErrors() {
      const seen = new Set();
      const messages = [];
      for (const e of this.data.errors || []) {
        if (e && e.message && !seen.has(e.message)) {
          seen.add(e.message);
          messages.push(e.message);
        }
      }
      this.setData({ messages, listed: messages.length > 1, hasContent: messages.length > 0 || !!this.data.slotted });
    },
  },
});
