export const props = {
  /** The count to draw (falls back to 0). Decorative — aria-hidden. */
  value: {
    type: null,
    optionalTypes: [Number],
    value: 0,
  },
  /** How many marks to draw at most. */
  max: {
    type: null,
    optionalTypes: [Number],
    value: 20,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
