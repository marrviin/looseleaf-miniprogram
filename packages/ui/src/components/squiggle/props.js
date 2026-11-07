/**
 * ll-squiggle properties — upstream Squiggle (<div> separator): a hand-drawn
 * line across (or down) the box, between paragraphs or sections.
 */
export const props = {
  /** 'wavy' | 'zigzag' | 'loops' | 'scallops' | 'dashes' | 'dots'. */
  kind: {
    type: String,
    value: 'wavy',
  },
  /** 'horizontal' (h-4 w-full) | 'vertical' (w-4, full height). */
  orientation: {
    type: String,
    value: 'horizontal',
  },
  /** false = a real separator (separator role) rather than decoration. */
  decorative: {
    type: null,
    optionalTypes: [Boolean, String],
    value: true,
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
  kind: ['wavy', 'zigzag', 'loops', 'scallops', 'dashes', 'dots'],
  orientation: ['horizontal', 'vertical'],
  tone: ['ink', 'blue', 'red', 'green', 'pencil', 'marker', 'orange'],
  weight: ['fine', 'regular', 'brush'],
};
