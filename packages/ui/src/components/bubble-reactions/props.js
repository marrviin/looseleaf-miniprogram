/**
 * ll-bubble-reactions properties — upstream BubbleReactions (bubble.tsx):
 * a sticker chip on the edge of a bubble.
 */
export const props = {
  /** Which edge of the bubble it overlaps. */
  side: {
    type: String,
    value: 'bottom',
  },
  /** Which corner. */
  align: {
    type: String,
    value: 'end',
  },
  dashed: {
    type: Boolean,
    value: false,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
