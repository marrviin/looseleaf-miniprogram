/**
 * ll-stamp properties — upstream Stamp (stamp.tsx): solid ink pressed
 * through a worn pad, double-rule border, typewriter capitals, a slight
 * tilt and sometimes the ghost of a first impression.
 */
export const props = {
  /** Preset name from the sticker library: stamp-approved, stamp-draft,
      stamp-paid, stamp-urgent, stamp-received, stamp-void, stamp-new,
      stamp-member. Its text/shape/ink/size/tilt fill in unset props. */
  name: {
    type: String,
    value: '',
  },
  /** The word(s), typewriter capitals. */
  text: {
    type: String,
    value: '',
  },
  /** rect, round, burst, void. */
  shape: {
    type: String,
    value: '',
  },
  /** Pad ink: red, ink-you (blue felt), green, ink. */
  ink: {
    type: String,
    value: '',
  },
  /** Small second line (e.g. a date). */
  sub: {
    type: String,
    value: '',
  },
  /** Rim text (round). */
  ring: {
    type: String,
    value: '',
  },
  /** Pixels wide; `size` sets both w and h. */
  w: {
    type: null,
    optionalTypes: [Number, String],
    value: 0,
  },
  h: {
    type: null,
    optionalTypes: [Number, String],
    value: 0,
  },
  size: {
    type: null,
    optionalTypes: [Number, String],
    value: 0,
  },
  /** Degrees of tilt (presets carry their own). */
  tilt: {
    type: null,
    optionalTypes: [Number, String],
    value: 0,
  },
  /** The ghost of a first impression. */
  ghost: {
    type: null,
    optionalTypes: [Boolean, String],
    value: '',
  },
  /** Dashed border. */
  dashed: {
    type: null,
    optionalTypes: [Boolean, String],
    value: '',
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  /** Accessible name; defaults to the text. */
  label: {
    type: String,
    value: '',
  },
  customStyle: String,
};

export const validators = {
  shape: ['rect', 'round', 'burst', 'void'],
  ink: ['red', 'ink-you', 'green', 'ink'],
};
