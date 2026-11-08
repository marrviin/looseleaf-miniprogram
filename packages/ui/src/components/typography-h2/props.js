/**
 * ll-typography-h2 properties — upstream typography typography-h2.
 */
export const props = {
  /** Draw the pencil rule under the heading. */
  rule: {
    type: Boolean,
    value: true,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
