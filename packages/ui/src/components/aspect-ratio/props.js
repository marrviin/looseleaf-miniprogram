/**
 * ll-aspect-ratio properties — upstream AspectRatio (radix wrapper).
 */
export const props = {
  /** width / height, e.g. 16/9 → 1.777. */
  ratio: {
    type: null,
    optionalTypes: [Number, String],
    value: 1,
  },
  customStyle: String,
};
