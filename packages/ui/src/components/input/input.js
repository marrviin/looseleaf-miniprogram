import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Input` — the drawn pencil box (input recipe → drawFieldFrame:
    slip wash + pencil box, hover re-ink, blue felt focus ring, invalid =
    red frame + wavy underline + !, disabled = dashes on a pale wash,
    readOnly = printed) around a real <input>. Focus/blur toggle the ring
    through the shared focusVisible state; typing stays native. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'input',
    llInkSelector: '.ll-input',
  },
  observers: {
    'disabled, invalid, readOnly'() {
      this.__inkParams = () => ({
        disabled: !!this.data.disabled,
        invalid: !!this.data.invalid,
        readOnly: !!this.data.readOnly,
      });
      setTimeout(() => this.__renderInk(), 0);
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({
        disabled: !!this.data.disabled,
        invalid: !!this.data.invalid,
        readOnly: !!this.data.readOnly,
      });
    },
  },
  methods: {
    onInput(e) {
      this.triggerEvent('input', { value: e.detail.value });
    },
    onFocus() {
      // data-ink-focus="within" upstream: the frame lights its focus ring
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
