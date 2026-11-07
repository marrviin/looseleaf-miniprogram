/**
 * ll-seal properties — upstream Seal (seal.tsx): rosettes, scalloped seals,
 * medals, ringed seals with rim lettering and wax seals, drawn like the
 * stickers without the white edge.
 */
export const props = {
  /** The shape. Rosette and medal hang a ribbon; ring letters its rim; wax
      is a blob of sealing wax with an impression. */
  variant: {
    type: String,
    value: 'scallop',
  },
  /** The words in the middle (capitals are set for you). One or two initials
      on wax. */
  text: {
    type: String,
    value: '',
  },
  /** A smaller second line (from 96px up; dropped in the small redraw). */
  sub: {
    type: String,
    value: '',
  },
  /** A hand-drawn check or star takes the place of the words. */
  mark: {
    type: String,
    value: '',
  },
  /** Any stationery color (wax: red, grape, ...). */
  tone: {
    type: String,
    value: '',
  },
  /** Ribbon tone on a rosette or medal. */
  ribbon: {
    type: String,
    value: '',
  },
  /** Ring rim lettering (ring variant, from 72px up). */
  ring: {
    type: String,
    value: '',
  },
  /** Badge deco: tick, star, sparkle, swoosh, percent. */
  deco: {
    type: String,
    value: '',
  },
  /** Pixels across (16 and up). */
  size: {
    type: null,
    optionalTypes: [Number, String],
    value: 96,
  },
  /** Engine tier: 'lo' (default) or 'hi' (heavier, ~2x the weight). */
  tier: {
    type: String,
    value: 'lo',
  },
  /** true/'auto' = seed-derived swing (clamped to ±3.2deg like upstream);
      number = explicit degrees; false = none. */
  tilt: {
    type: null,
    optionalTypes: [Boolean, Number, String],
    value: 0,
  },
  /** The sticker's soft shadow (upstream .ll-drop-sticker). */
  shadow: {
    type: null,
    optionalTypes: [Boolean, String],
    value: true,
  },
  /** aria-hidden img — no role, no name. */
  decorative: {
    type: null,
    optionalTypes: [Boolean, String],
    value: false,
  },
  /** Accessible name; defaults to the words, the mark, or "<variant> seal". */
  label: {
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

export const validators = {
  variant: ['scallop', 'starburst', 'rosette', 'medal', 'shield', 'plate', 'ticket', 'tag', 'ring', 'wax'],
  mark: ['check', 'star'],
};
