export const props = {
  /** The value this radio contributes to the group. */
  value: {
    type: String,
    value: '',
  },
  /** Standalone checked state (inside a group the group's value wins). */
  checked: {
    type: Boolean,
    value: false,
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  invalid: {
    type: Boolean,
    value: false,
  },
  /** px — upstream size-N classes; 16, 20 and 28 are drawn and tested. */
  size: {
    type: null,
    optionalTypes: [Number, String],
    value: null,
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};
