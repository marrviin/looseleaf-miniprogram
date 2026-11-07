export const props = {
  /** Controlled values — one number per thumb. Uncontrolled: set defaultValue. */
  value: {
    type: null,
    optionalTypes: [Array],
    value: null,
  },
  defaultValue: {
    type: null,
    optionalTypes: [Array],
    value: null,
  },
  min: {
    type: null,
    optionalTypes: [Number],
    value: 0,
  },
  max: {
    type: null,
    optionalTypes: [Number],
    value: 100,
  },
  step: {
    type: null,
    optionalTypes: [Number],
    value: 1,
  },
  /** Pencil tick marks under the groove: true = every step (≤20) else ten
      intervals; a number = that many intervals (upstream ticks). */
  ticks: {
    type: null,
    optionalTypes: [Boolean, Number],
    value: null,
  },
  /** What colors the range: marker (terracotta), hi (highlighter), blue. */
  tone: {
    type: String,
    value: 'marker',
  },
  orientation: {
    type: String,
    value: 'horizontal',
  },
  inverted: {
    type: Boolean,
    value: false,
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  /** Red pencil groove + knob loop (upstream aria-invalid). */
  invalid: {
    type: Boolean,
    value: false,
  },
  /** Range sliders: keep the thumbs this many steps apart. */
  minStepsBetweenThumbs: {
    type: null,
    optionalTypes: [Number],
    value: 0,
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};
