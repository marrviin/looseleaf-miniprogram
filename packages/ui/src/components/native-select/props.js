export const props = {
  /** Flat: 'Iceland' or { label, value }; grouped: { label, options: [...] }
      — the system picker is a flat list, so groups fold flat (headers are
      dropped; upstream keeps them because the popup is the browser's own). */
  options: {
    type: Array,
    value: [],
  },
  value: {
    type: String,
    value: '',
  },
  defaultValue: {
    type: String,
    value: '',
  },
  /** Shown when nothing is selected (upstream uses a first option with an
      empty value as the placeholder — pass that option here instead). */
  placeholder: {
    type: String,
    value: '',
  },
  /** 'default' | 'sm' (upstream data-size). */
  size: {
    type: String,
    value: 'default',
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  /** Red pencil box and a bang before the chevron (upstream aria-invalid). */
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

export const validators = {
  size: ['default', 'sm'],
};
