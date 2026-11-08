/**
 * ll-envelope properties — upstream Envelope (envelope.tsx): a Radix
 * Collapsible whose back sheet's flap stands up when it opens.
 * `openOnHover` is not portable (no mouse hover on touch).
 */
export const props = {
  /** What the envelope is made of: 'kraft', 'paper', ... */
  stock: {
    type: String,
    value: 'kraft',
  },
  /** Stamp accent color: 'tomato', 'sky', 'tangerine', 'grape'... or false
      for no stamp (the postmark goes with it). */
  stamp: {
    type: null,
    optionalTypes: [String, Boolean],
    value: 'tomato',
  },
  /** Cancel the postmark rings. */
  postmark: {
    type: Boolean,
    value: true,
  },
  /** Striped airmail border. */
  airmail: {
    type: Boolean,
    value: false,
  },
  /** Open state (controlled). */
  open: {
    type: null,
    optionalTypes: [Boolean],
    value: null,
  },
  /** Start open (uncontrolled). */
  defaultOpen: {
    type: Boolean,
    value: false,
  },
  disabled: Boolean,
  /** Hand-drawn tilt: true picks a seeded angle (±1.1deg), a number sets it,
      false squares it up. */
  tilt: {
    type: null,
    optionalTypes: [Number],
    value: true,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
