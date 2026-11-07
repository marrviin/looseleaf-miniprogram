export const props = {
  /** The number under (and driving) the bars. */
  value: {
    type: String,
    value: '',
  },
  /** Drawing height in upstream px (viewBox stretches to the full width). */
  height: {
    type: null,
    optionalTypes: [Number, String],
    value: 44,
  },
  customStyle: String,
};
