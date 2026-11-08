/**
 * ll-handwritten properties — upstream Handwritten (any element whose text
 * nodes are split into word spans). The miniprogram can't walk slot
 * children, so the text comes in as a prop; code/links/forms "left
 * exactly as typed" is a page-level composition here.
 */
export const props = {
  /** The line to write. Whitespace is kept between words. */
  text: {
    type: String,
    value: '',
  },
  /** 0 renders plain text (no spans), 1 the default hand, 2 a hurried one. */
  strength: {
    type: null,
    optionalTypes: [Number, String],
    value: 1,
  },
  /** Pins the hand — the same seed always writes the same line. */
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
