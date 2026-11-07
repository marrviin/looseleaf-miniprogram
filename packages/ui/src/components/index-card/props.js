/**
 * ll-index-card properties — upstream IndexCard (index-card.tsx): a Paper
 * (index-card stock, index rules) as a flex column. Every Paper prop except
 * stock/rules; the card turns under a quarter of a degree (tiltMax 0.225).
 */
export const props = {
  /** Punch the rod hole at the bottom center, under the last blue line. */
  hole: {
    type: null,
    optionalTypes: [Boolean, String],
    value: false,
  },
  /** A translucent plastic flag stuck over the end edge: an accent
      (tomato…bubblegum) or false. */
  flag: {
    type: null,
    optionalTypes: [String, Boolean],
    value: false,
  },
  /** Cards visible behind this one, at its foot and far edge (0-3). */
  stack: {
    type: null,
    optionalTypes: [Number, String],
    value: 0,
  },
  /** Tape strips: 'corner' | 'top' | 'both' | false. */
  tape: {
    type: null,
    optionalTypes: [String, Boolean],
    value: false,
  },
  tapeKind: {
    type: String,
    value: 'masking',
  },
  /** Fastener: 'clip' | 'pin' | 'staple' | 'binder-clip' | false. */
  fastener: {
    type: null,
    optionalTypes: [String, Boolean],
    value: false,
  },
  fastenerTone: {
    type: String,
    value: '',
  },
  /** true = seeded (max ~0.225deg); number = degrees; false = flat. */
  tilt: {
    type: null,
    optionalTypes: [Boolean, Number, String],
    value: true,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
