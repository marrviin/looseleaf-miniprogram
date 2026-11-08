/**
 * ll-bubble-content properties — upstream BubbleContent (bubble.tsx).
 * variant/align/shape/pen arrive from the enclosing Bubble through relations.
 */
export const props = {
  /** Pins the hand: the same seed always draws the same bubble. */
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  /** Upstream asChild: the bubble becomes a real button (drop-lines on
      press, tap bubbles). */
  interactive: {
    type: Boolean,
    value: false,
  },
  /** For `note`/`sticky`: Paper overrides ({tilt, fastener, tape, edge, seed}). */
  paper: {
    type: null,
    optionalTypes: [Object],
    value: null,
  },
  customStyle: String,
};
