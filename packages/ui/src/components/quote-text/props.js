/**
 * ll-quote-text properties — upstream QuoteText.
 */
export const props = {
  /** 'sm' | 'md' | 'lg'. */
  size: {
    type: String,
    value: 'md',
  },
  /** MarkPen — 'marker' | 'ink' | 'blue' | 'red' | 'green' | 'pencil'... */
  tone: {
    type: String,
    value: 'marker',
  },
  /** 'regular' | 'fine' | 'brush'. */
  weight: {
    type: String,
    value: 'regular',
  },
  /** Pencil rule down the left of the marks. */
  rule: {
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
