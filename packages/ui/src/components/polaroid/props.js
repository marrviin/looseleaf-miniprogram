/**
 * ll-polaroid properties — upstream Polaroid (polaroid.tsx): a Paper
 * (photo stock, no printed rules) 16rem wide, flex column, padded 14px on
 * the sides and top with a taller foot. Every Paper prop except
 * stock/rules/as.
 */
export const props = {
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
  /** true = seeded from the photo stock (max ~1.5deg); number = degrees;
      false = flat. */
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
