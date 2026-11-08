/**
 * ll-bubble properties — upstream Bubble (bubble.tsx): the row of one message
 * body. Shares variant/align/shape/pen with its BubbleContent.
 */
export const props = {
  /** The ink: default (blue marker), secondary (highlighter), muted (paper
      shade), tinted (marker wash), outline (paper + line), ghost (prose),
      destructive (red pencil hatching). */
  variant: {
    type: String,
    value: 'default',
  },
  /** Which end of the row it sits on; the tail follows. Defaults to the
      enclosing Message's align. */
  align: {
    type: String,
    value: '',
  },
  /** cloud = a hand-drawn speech bubble; note | sticky = a Paper. */
  shape: {
    type: String,
    value: 'cloud',
  },
  /** `you` writes the outline in blue felt and the words in the script font. */
  pen: {
    type: String,
    value: 'ink',
  },
  /** Draw the tail flick. Earlier bubbles of a BubbleGroup hide it anyway. */
  tail: {
    type: Boolean,
    value: true,
  },
  customStyle: String,
};
