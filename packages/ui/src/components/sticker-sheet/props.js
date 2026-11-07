/**
 * ll-sticker-sheet properties — upstream StickerSheet (sticker-sheet.tsx):
 * a kiss-cut sheet on release paper. Upstream's StickerSheetItem children
 * become plain `stickers` names here (a component cannot share state with
 * slot content in WeChat — see component-guide "relations don't work
 * through slots").
 */
export const props = {
  /** Sticker names from the library; each becomes a peelable cell. */
  stickers: {
    type: Array,
    value: [],
  },
  columns: {
    type: null,
    optionalTypes: [Number, String],
    value: 4,
  },
  /** Cell sticker size in px (cell = size + 22). */
  size: {
    type: null,
    optionalTypes: [Number, String],
    value: 72,
  },
  title: {
    type: String,
    value: '',
  },
  /** glassine (release paper + sheen) | kraft | paper. */
  backing: {
    type: String,
    value: 'glassine',
  },
  /** Controlled peeled ids; leave unset for uncontrolled. */
  peeled: {
    type: null,
    optionalTypes: [Array, String],
    value: null,
  },
  defaultPeeled: {
    type: Array,
    value: [],
  },
  /** When false, a peeled sticker cannot be stuck back. */
  restorable: {
    type: null,
    optionalTypes: [Boolean, String],
    value: true,
  },
  disabled: {
    type: null,
    optionalTypes: [Boolean, String],
    value: false,
  },
  label: {
    type: String,
    value: 'Sticker sheet',
  },
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

export const validators = {
  backing: ['glassine', 'kraft', 'paper'],
};
