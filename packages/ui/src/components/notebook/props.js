/**
 * ll-notebook properties — upstream Notebook (notebook.tsx): an open
 * notebook on the desk, ruled paper bound with a wire spiral, binder
 * rings or a stab-stitched spine, more pages peeking out underneath, and
 * an optional dog-ear for turning pages.
 *
 * `as` is not portable. Pages are ll-notebook-page descendants (shown or
 * hidden by value); the corner button is ll-notebook-turn.
 */
export const props = {
  /** 'spiral' | 'rings' | 'stitched' | 'none'. */
  binding: {
    type: String,
    value: 'spiral',
  },
  /** 'start' (left edge, bound like a book) | 'top' (a reporter's pad). */
  side: {
    type: String,
    value: 'start',
  },
  /** Sheets peeking out under this one: 0–3. */
  pages: {
    type: null,
    optionalTypes: [Number, String],
    value: 2,
  },
  /** Wire color ('steel') or thread color for a stitched binding (an
      accent). '' = steel. */
  tone: {
    type: String,
    value: '',
  },
  /** Fold the bottom-right corner (a dog-ear); pair with
      ll-notebook-turn. */
  curl: {
    type: Boolean,
    value: false,
  },
  /** Printed rules; '' = 'ruled' ('pad' when bound on top). */
  rules: {
    type: String,
    value: '',
  },
  stock: {
    type: String,
    value: 'paper',
  },
  /** Which ll-notebook-page is shown. Set to control; otherwise
      defaultValue starts it and turn() moves it. */
  value: {
    type: null,
    optionalTypes: [String],
    value: null,
  },
  defaultValue: {
    type: String,
    value: '',
  },
  tilt: {
    type: null,
    optionalTypes: [Boolean, Number, String],
    value: true,
  },
  tape: {
    type: null,
    optionalTypes: [String, Boolean],
    value: false,
  },
  tapeKind: {
    type: String,
    value: 'masking',
  },
  fastener: {
    type: null,
    optionalTypes: [String, Boolean],
    value: false,
  },
  fastenerTone: {
    type: String,
    value: '',
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  ariaLabel: String,
  customStyle: String,
};
