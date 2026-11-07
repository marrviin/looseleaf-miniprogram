import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Textarea` — the drawn pencil box (textarea recipe →
    drawFieldFrame with multiline: ruled lines on the baselines, the drawn
    resize grip) around a real <textarea> that grows with its text, with an
    optional character counter in the corner. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'textarea',
    llInkSelector: '.ll-textarea',
    count: 0,
  },
  observers: {
    'disabled, invalid, readOnly, ruled'() {
      this.__inkParams = () => ({
        disabled: !!this.data.disabled,
        invalid: !!this.data.invalid,
        readOnly: !!this.data.readOnly,
        ruled: !!this.data.ruled,
        lineHeight: 28,
        ruleTop: 8,
        grip: true, // the drawn resize handle — always shown, as upstream
      });
      setTimeout(() => this.__measureInk(), 0);
    },
    value() {
      this.__updateCount();
      // auto-height growth changes the frame box — re-measure and redraw
      setTimeout(() => this.__measureInk(), 0);
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({
        disabled: !!this.data.disabled,
        invalid: !!this.data.invalid,
        readOnly: !!this.data.readOnly,
        ruled: !!this.data.ruled,
        lineHeight: 28,
        ruleTop: 8,
        grip: true,
      });
      this.__updateCount();
      // The native textarea reports its default 300×150 box before auto-height
      // settles — re-measure once layout has settled so the ink isn't misdrawn.
      setTimeout(() => this.__measureInk(), 300);
      setTimeout(() => this.__measureInk(), 800);
    },
  },
  methods: {
    __updateCount() {
      if (!this.data.showCount) return;
      const len = String(this.data.value ?? '').length;
      this.setData({ count: len });
    },
    onInput(e) {
      this.triggerEvent('input', { value: e.detail.value });
      // auto-height growth changes the frame box — re-measure and redraw
      setTimeout(() => this.__measureInk(), 0);
    },
    onFocus() {
      this.setData({ focusVisible: true });
      this.__applyInkLayer();
      this.triggerEvent('focus', {});
    },
    onBlur(e) {
      this.setData({ focusVisible: false });
      this.__applyInkLayer();
      this.triggerEvent('blur', { value: e.detail.value });
    },
    onConfirm(e) {
      this.triggerEvent('confirm', { value: e.detail.value });
    },
  },
});
