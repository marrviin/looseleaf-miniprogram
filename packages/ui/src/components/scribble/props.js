/**
 * ll-scribble properties — upstream Scribble (<span> element): a word
 * scribbled out, in front of the words. text/show/animate/seed live in the
 * shared mark behavior (common/mark.js).
 */
export const props = {
  /** MarkPen — the pen of the change of mind. */
  tone: {
    type: String,
    value: 'ink',
  },
  /** MarkWeight — fine-liner (leaves the words readable), felt or brush. */
  weight: {
    type: String,
    value: 'regular',
  },
  customStyle: String,
};

export const validators = {
  tone: ['ink', 'blue', 'red', 'green', 'pencil', 'marker', 'orange'],
  weight: ['fine', 'regular', 'brush'],
};
