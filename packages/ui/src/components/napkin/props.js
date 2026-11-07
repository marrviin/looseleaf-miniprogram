/**
 * ll-napkin properties — upstream Napkin (napkin.tsx): a sheet of the napkin
 * stock (crimped edge, cold-pressed tooth) with fold creases and an optional
 * coffee-ring stain drawn by the napkin-decor recipe.
 */
export const props = {
  /** NapkinFold — 'quarter' | 'half' | 'none'. */
  fold: {
    type: String,
    value: 'quarter',
  },
  /** Draw a coffee ring on the tissue. */
  stain: {
    type: Boolean,
    value: false,
  },
  /** Paper passthrough — see ll-paper. */
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

export const validators = {
  fold: ['quarter', 'half', 'none'],
};
