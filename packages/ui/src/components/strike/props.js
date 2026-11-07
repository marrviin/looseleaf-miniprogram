/**
 * ll-strike properties — upstream Strike (<s> element): a pencil line
 * through real words. text/show/animate/seed live in the shared mark
 * behavior (common/mark.js).
 */
export const props = {
  /** 'single' one line | 'double' two lines | 'cross' one X over the box. */
  kind: {
    type: String,
    value: 'single',
  },
  /** MarkPen — the pen. Red is a waxy colored pencil. */
  tone: {
    type: String,
    value: 'red',
  },
  /** MarkWeight — fine-liner, regular or brush. */
  weight: {
    type: String,
    value: 'regular',
  },
  customStyle: String,
};

export const validators = {
  kind: ['single', 'double', 'cross'],
  tone: ['ink', 'blue', 'red', 'green', 'pencil', 'marker', 'orange'],
  weight: ['fine', 'regular', 'brush'],
};
