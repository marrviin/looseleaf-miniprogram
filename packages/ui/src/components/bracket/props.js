/**
 * ll-bracket properties — upstream Bracket (<div> wrapper): a hand-drawn
 * bracket down one side of the content. The content flows through the slot.
 */
export const props = {
  /** 'square' | 'curly' | 'round'. */
  kind: {
    type: String,
    value: 'square',
  },
  /** 'start' (left, padding-left) | 'end' (right, padding-right). */
  side: {
    type: String,
    value: 'start',
  },
  /** MarkPen — the pen. */
  tone: {
    type: String,
    value: 'ink',
  },
  /** MarkWeight — fine-liner, felt or brush. */
  weight: {
    type: String,
    value: 'regular',
  },
  /** px — gap between the bracket and the content (upstream inset, 8). */
  inset: {
    type: null,
    optionalTypes: [Number, String],
    value: 8,
  },
  /** Approximates upstream MARK_REVEAL with a fade+rise of the ink layer. */
  animate: {
    type: null,
    optionalTypes: [Boolean, String],
    value: false,
  },
  show: {
    type: null,
    optionalTypes: [Boolean, String],
    value: true,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};

export const validators = {
  kind: ['square', 'curly', 'round'],
  side: ['start', 'end'],
  tone: ['ink', 'blue', 'red', 'green', 'pencil', 'marker', 'orange'],
  weight: ['fine', 'regular', 'brush'],
};
