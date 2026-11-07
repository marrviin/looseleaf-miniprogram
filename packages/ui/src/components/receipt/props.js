/**
 * ll-receipt properties — upstream Receipt (receipt.tsx): the receipt stock
 * (zig-zag tears top and bottom) with the typed lines of a till roll.
 * `ends` is the cut of both ends.
 */
export const props = {
  /** EdgeKind for both ends: 'zig' | 'perf' | 'torn' | 'cut' | ... */
  ends: {
    type: String,
    value: 'zig',
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
  ends: ['zig', 'perf', 'torn', 'cut', 'deckle', 'crimp', 'scallop'],
};
