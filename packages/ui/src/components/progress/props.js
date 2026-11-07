export const props = {
  /** How far along, out of max. Omit / null / NaN → indeterminate scribble. */
  value: {
    type: null,
    optionalTypes: [Number],
    value: null,
  },
  max: {
    type: null,
    optionalTypes: [Number],
    value: 100,
  },
  /** 12, 16 or 20 px tall ("sm" / "default" / "lg"). */
  size: {
    type: String,
    value: 'default',
  },
  /** The ink: marker, hi (highlighter), green, blue. */
  tone: {
    type: String,
    value: 'marker',
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};
