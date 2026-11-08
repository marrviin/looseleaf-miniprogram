import { createComponent } from '../../common/component';

export const props = {
  value: {
    type: String,
    value: '',
  },
  placeholder: {
    type: String,
    value: '',
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  /** Red-pencil the group's box (upstream aria-invalid on the control). */
  invalid: {
    type: Boolean,
    value: false,
  },
  /** WeChat input types: text / number / idcard / digit / safe-password / nickname. */
  type: {
    type: String,
    value: 'text',
  },
  password: {
    type: Boolean,
    value: false,
  },
  maxlength: {
    type: Number,
    value: 140,
    optionalTypes: [Number, String],
  },
  confirmType: {
    type: String,
    value: 'done',
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};

/** ll-input-group-input — upstream InputGroupInput: the bare input of
    Input (no frame of its own — the group draws one box around
    everything). Its focus / invalid / disabled state paints the group's
    box through the ancestor relation. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: '',
    inputFocus: false,
  },
  relations: {
    '../input-group/input-group': {
      type: 'ancestor',
      linked(parent) {
        this.__group = parent;
        setTimeout(() => this.reportState(), 0);
      },
      unlinked() {
        this.__group = null;
      },
    },
  },
  observers: {
    'disabled, invalid'() {
      this.reportState();
    },
  },
  methods: {
    reportState() {
      if (this.__group) {
        this.__group.syncControl({
          focus: this.data.inputFocus,
          invalid: !!this.data.invalid,
          disabled: !!this.data.disabled,
        });
      }
    },
    focus() {
      // addon taps land here (upstream: clicking an addon focuses the input)
      this.setData({ inputFocus: true });
      this.reportState();
    },
    blur() {
      this.setData({ inputFocus: false });
      this.reportState();
    },
    onInput(e) {
      this.triggerEvent('input', { value: e.detail.value });
    },
    onFocus() {
      this.setData({ inputFocus: true });
      this.reportState();
      this.triggerEvent('focus', {});
    },
    onBlur(e) {
      this.setData({ inputFocus: false });
      this.reportState();
      this.triggerEvent('blur', { value: e.detail.value });
    },
    onConfirm(e) {
      this.triggerEvent('confirm', { value: e.detail.value });
    },
  },
});
