export const props = {
  /** The chosen radio's value (controlled; tap fires change). */
  value: {
    type: String,
    value: '',
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  /** Red pencil for every radio in the group (upstream aria-invalid). */
  invalid: {
    type: Boolean,
    value: false,
  },
  orientation: {
    type: String,
    value: 'vertical',
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};
