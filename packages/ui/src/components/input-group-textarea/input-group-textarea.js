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
  maxlength: {
    type: Number,
    value: -1,
    optionalTypes: [Number, String],
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};

/** ll-input-group-textarea — upstream InputGroupTextarea: the bare
    textarea of Textarea inside the group's one drawn box; it grows with
    its text and the box is redrawn to fit. The group stacks into a column
    (block addons above/below) once this control is present. */
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
        parent.setData({ multiline: true, hasBlock: true });
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
    value() {
      // auto-height growth changes the box — ask the group to re-measure
      setTimeout(() => this.__group && this.__group.__measureInk(), 0);
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
      this.setData({ inputFocus: true });
      this.reportState();
    },
    blur() {
      this.setData({ inputFocus: false });
      this.reportState();
    },
    onInput(e) {
      this.triggerEvent('input', { value: e.detail.value });
      setTimeout(() => this.__group && this.__group.__measureInk(), 0);
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
  },
});
