/**
 * ll-tape properties — upstream Tape (tape.tsx), a strip of tape drawn as a
 * fixed-size PropSvg (no recipe, no measuring).
 */
export const props = {
  /** TapeKind — masking | washi-dots | washi-stripes | washi-zigzag | washi-gingham | kraft | clear. */
  kind: {
    type: String,
    value: 'masking',
  },
  /** Along the strip, px. */
  length: {
    type: Number,
    value: 72,
  },
  /** Across the strip, px. */
  height: {
    type: Number,
    value: 22,
  },
  /** Degrees it lies at; '' = seeded within ±4 (clamped ±5 like a sheet's tilt). */
  angle: {
    type: null,
    optionalTypes: [Number, String],
    value: '',
  },
  /** 'saw' | 'torn' | 'straight' | 'scissor'; '' follows the kind. */
  ends: {
    type: String,
    value: '',
  },
  /** Print color of a washi tape: tomato…bubblegum. */
  color: {
    type: String,
    value: '',
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
