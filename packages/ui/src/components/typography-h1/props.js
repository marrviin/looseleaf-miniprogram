/**
 * ll-typography-h1 properties — upstream typography typography-h1.
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
