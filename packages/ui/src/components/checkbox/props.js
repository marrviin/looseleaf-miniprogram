export const props = {
  /** px — upstream size-N classes; 16, 20 and 28 are drawn and tested. */
  size: {
    type: null,
    optionalTypes: [Number, String],
    value: null,
  },
  checked: {
    type: Boolean,
    value: false,
  },
  indeterminate: {
    type: Boolean,
    value: false,
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  /** Red box + red stroke (upstream aria-invalid). */
  invalid: {
    type: Boolean,
    value: false,
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};
