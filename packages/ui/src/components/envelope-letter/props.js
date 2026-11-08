/** ll-envelope-letter properties — upstream `EnvelopeLetter` (a Paper).
    Open state comes from the parent ll-envelope. */
export const props = {
  stock: {
    type: String,
    value: 'paper',
  },
  rules: {
    type: null,
    optionalTypes: [String],
    value: 'none',
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
