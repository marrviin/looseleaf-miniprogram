/**
 * ll-stamp-button properties — upstream StampButton (stamp-button.tsx): a
 * button that is a rubber stamp — a wooden knob on an inked die in the
 * color of the impression it will leave. The impression itself is placed
 * by an ll-stamp-surface (state cannot cross a component boundary here, so
 * the button reports and the page wires it: bind:stamp → surface.strike()).
 */
export const props = {
  /** Preset from the sticker sheet: stamp-approved, stamp-paid, stamp-void,
      stamp-urgent, stamp-received, stamp-draft, stamp-new, stamp-member.
      Other props override it. */
  stamp: {
    type: String,
    value: '',
  },
  /** The words for a custom stamp (also the default label). */
  text: {
    type: String,
    value: '',
  },
  /** rect, round, burst, void. */
  shape: {
    type: String,
    value: '',
  },
  /** Pad ink: red, ink-you, green, ink. Default the preset's. */
  ink: {
    type: String,
    value: '',
  },
  /** Small second line on the impression (e.g. a date). */
  sub: {
    type: String,
    value: '',
  },
  /** Rim text (round). */
  ring: {
    type: String,
    value: '',
  },
  /** Pixels wide / tall on the impression. */
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
  /** One in five impressions is a faint double strike; force it on/off. */
  ghost: {
    type: null,
    optionalTypes: [Boolean],
    value: null,
  },
  /** Dashed border on the impression. */
  dashed: {
    type: Boolean,
    value: false,
  },
  /** Names the stamp on the page: the same id replaces its impression
      instead of adding one. Default the preset or the text. */
  impressionId: {
    type: String,
    value: '',
  },
  /** Where to aim, as fractions of the surface. Every strike wanders up
      to 3% from it. */
  placeX: {
    type: null,
    optionalTypes: [Number, String],
    value: 0.72,
  },
  placeY: {
    type: null,
    optionalTypes: [Number, String],
    value: 0.6,
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: {
    type: String,
    value: '',
  },
};

export const validators = {
  shape: ['rect', 'round', 'burst', 'void'],
  ink: ['red', 'ink-you', 'green', 'ink'],
};
