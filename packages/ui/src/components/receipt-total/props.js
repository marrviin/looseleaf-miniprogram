export const props = {
  /** The word on the left. */
  label: {
    type: String,
    value: 'TOTAL',
  },
  /** false = plain; true | 'red' = red felt tip, 'blue', 'ink'. */
  circled: {
    type: null,
    optionalTypes: [Boolean, String],
    value: false,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};

export const validators = {
  circled: [false, true, 'red', 'blue', 'ink'],
};
