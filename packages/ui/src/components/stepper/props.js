export const props = {
  /** Controlled value. null = empty field (upstream undefined). */
  value: {
    type: null,
    optionalTypes: [Number],
    value: null,
  },
  defaultValue: {
    type: null,
    optionalTypes: [Number],
    value: null,
  },
  min: {
    type: null,
    optionalTypes: [Number],
    value: null,
  },
  max: {
    type: null,
    optionalTypes: [Number],
    value: null,
  },
  step: {
    type: null,
    optionalTypes: [Number],
    value: 1,
  },
  /** Shift+arrow / PageUp-PageDown step (upstream largeStep, default 10×step). */
  largeStep: {
    type: null,
    optionalTypes: [Number],
    value: null,
  },
  /** Round typed and stepped values to multiples of step from min (or 0). */
  snap: {
    type: Boolean,
    value: false,
  },
  /** Decimal places to show and round to; default from step/min. */
  precision: {
    type: null,
    optionalTypes: [Number],
    value: null,
  },
  /** Display prefix/suffix (upstream takes format/parse functions; the
      miniprogram can't pass those — this covers the "$"/" g" cases). */
  prefix: {
    type: String,
    value: '',
  },
  suffix: {
    type: String,
    value: '',
  },
  /** An empty field is refused (a blank is put back). */
  required: {
    type: Boolean,
    value: false,
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  /** A value that is shown but not changed. */
  readOnly: {
    type: Boolean,
    value: false,
  },
  /** The red pencil box (invalid && !disabled, as upstream). */
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
