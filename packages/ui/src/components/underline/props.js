/**
 * ll-underline properties — upstream Underline (<span> element): a pen line
 * under real words. text/show/animate/seed live in the shared mark behavior
 * (common/mark.js).
 */
export const props = {
  /** 'single' rises to the right | 'double' two pulls | 'wavy' a squiggle
      | 'scribble' a fast zig-zag. */
  kind: {
    type: String,
    value: 'single',
  },
  /** MarkPen — the pen. Blue is the reserved "you" felt; red corrects. */
  tone: {
    type: String,
    value: 'ink',
  },
  /** MarkWeight — fine-liner, felt tip or brush. */
  weight: {
    type: String,
    value: 'regular',
  },
  customStyle: String,
};

export const validators = {
  kind: ['single', 'double', 'wavy', 'scribble'],
  tone: ['ink', 'blue', 'red', 'green', 'pencil', 'marker', 'orange'],
  weight: ['fine', 'regular', 'brush'],
};
