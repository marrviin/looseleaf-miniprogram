export const props = {
  checked: {
    type: Boolean,
    value: false,
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  /** Red pencil outline (upstream aria-invalid). */
  invalid: {
    type: Boolean,
    value: false,
  },
  /** 44×24 px ("default") or 36×20 px ("sm"). */
  size: {
    type: String,
    value: 'default',
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};
