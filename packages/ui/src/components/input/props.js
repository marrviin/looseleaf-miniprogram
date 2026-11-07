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
