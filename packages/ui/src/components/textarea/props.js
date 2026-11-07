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
  /** Red pencil frame, wavy underline and ! (upstream aria-invalid). */
  invalid: {
    type: Boolean,
    value: false,
  },
  /** Printed look: pale wash, fine pencil box (upstream readOnly). */
  readOnly: {
    type: Boolean,
    value: false,
  },
  /** Pencil rules on the text baselines (upstream ruled). */
  ruled: {
    type: Boolean,
    value: false,
  },
  /** Grow with the text (upstream field-sizing: content). */
  autoGrow: {
    type: Boolean,
    value: true,
  },
  /** Character counter in the corner (upstream showCount). */
  showCount: {
    type: Boolean,
    value: false,
  },
  maxlength: {
    type: Number,
    value: -1,
    optionalTypes: [Number, String],
  },
  /** Focus the field on mount (upstream autoFocus). */
  focus: {
    type: Boolean,
    value: false,
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};
