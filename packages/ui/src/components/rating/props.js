export const props = {
  value: {
    type: null,
    optionalTypes: [Number, String],
    value: null,
  },
  defaultValue: {
    type: null,
    optionalTypes: [Number, String],
    value: 0,
  },
  max: {
    type: null,
    optionalTypes: [Number, String],
    value: 5,
  },
  /** Two radios per glyph (0.5 steps) — left/right half hit areas. */
  allowHalf: {
    type: Boolean,
    value: false,
  },
  readOnly: {
    type: Boolean,
    value: false,
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  required: {
    type: Boolean,
    value: false,
  },
  /** Red pen (upstream aria-invalid). */
  invalid: {
    type: Boolean,
    value: false,
  },
  /** star | heart | sun */
  icon: {
    type: String,
    value: 'star',
  },
  /** sm | default | lg */
  size: {
    type: String,
    value: 'default',
  },
  /** Clicking the chosen glyph again clears to 0. */
  clearable: {
    type: Boolean,
    value: false,
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};
