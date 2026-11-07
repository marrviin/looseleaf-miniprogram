export const props = {
  /** Optional leading quantity — renders `<qty> x ` before the name. */
  qty: {
    type: null,
    optionalTypes: [Number, String],
    value: null,
  },
  /** The typed price (a string so "9.00" keeps its trailing zero). */
  price: {
    type: String,
    value: '',
  },
  customStyle: String,
};
