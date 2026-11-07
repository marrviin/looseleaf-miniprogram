/**
 * ll-circled properties — upstream Circled (<span> element): a hand loop
 * around a word or phrase, drawn in front of the words. text/show/animate/
 * seed live in the shared mark behavior (common/mark.js).
 */
export const props = {
  /** 'circle' a loop | 'box' a rectangle | 'brackets' a [ … ] pair. */
  shape: {
    type: String,
    value: 'circle',
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
  /** px — how far the loop stands off the words (upstream bleed, default 2). */
  bleed: {
    type: null,
    optionalTypes: [Number, String],
    value: 2,
  },
  customStyle: String,
};

export const validators = {
  shape: ['circle', 'box', 'brackets'],
  tone: ['ink', 'blue', 'red', 'green', 'pencil', 'marker', 'orange'],
  weight: ['fine', 'regular', 'brush'],
};
