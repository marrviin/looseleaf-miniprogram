/**
 * ll-signature properties — upstream Signature (inline <span>): a name in
 * the script font with the pen's flourish drawn under it.
 */
export const props = {
  /** The pen's tail: a swoosh with a loop, a flourished underline, or
      nothing. */
  flourish: {
    type: String,
    value: 'swoosh',
  },
  /** The name at 28, 44 or 64 px (override with custom-style font-size). */
  size: {
    type: String,
    value: 'md',
  },
  /** MarkPen — the pen of the flourish (and the name color for blue/ink). */
  tone: {
    type: String,
    value: 'blue',
  },
  /** MarkWeight — fine-liner, felt tip or brush. */
  weight: {
    type: String,
    value: 'regular',
  },
  /** Sign it in: the name wipes left→right, the flourish follows. */
  animate: {
    type: Boolean,
    value: false,
  },
  /** Hide the flourish (the name always stays). */
  show: {
    type: Boolean,
    value: true,
  },
  /** Milliseconds before signing starts. */
  delay: {
    type: null,
    optionalTypes: [Number, String],
    value: 0,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};

export const validators = {
  flourish: ['swoosh', 'underline', 'none'],
  size: ['sm', 'md', 'lg'],
  tone: ['ink', 'blue', 'red', 'green', 'pencil', 'marker', 'orange'],
  weight: ['fine', 'regular', 'brush'],
};
