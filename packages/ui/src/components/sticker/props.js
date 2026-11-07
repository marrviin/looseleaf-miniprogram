/**
 * ll-sticker properties — upstream Sticker (sticker.tsx): die-cut vinyl,
 * white border, cut line, soft shadow, a small seeded tilt.
 */
export const props = {
  /** StickerName from the library (done, sale, cursor-click, ...). Unknown
      names draw nothing. */
  name: {
    type: String,
    value: '',
  },
  /** Requested size in px (the die-cut keeps its aspect). */
  size: {
    type: null,
    optionalTypes: [Number, String],
    value: 96,
  },
  /** false = flat; true = default fold; number = fold in px. Folds the
      lower-right corner over along a line perpendicular to the diagonal. */
  peel: {
    type: null,
    optionalTypes: [Boolean, Number, String],
    value: false,
  },
  /** Degrees; 'auto' = seeded tilt in +-3.2deg. */
  rotate: {
    type: null,
    optionalTypes: [Number, String],
    value: 'auto',
  },
  /** White border override in px. */
  border: {
    type: null,
    optionalTypes: [Number, String],
    value: '',
  },
  /** The drop-sticker shadow. */
  shadow: {
    type: null,
    optionalTypes: [Boolean, String],
    value: true,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  /** Accessible name; without it the svg is aria-hidden (decorative). */
  label: {
    type: String,
    value: '',
  },
  customStyle: String,
};
