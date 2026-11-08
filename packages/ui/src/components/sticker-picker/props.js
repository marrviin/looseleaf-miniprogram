/**
 * ll-sticker-picker properties — upstream StickerPicker + StickerPickerContent
 * folded into one component. The Popover API (side/align/pin/tape…) is not
 * exposed: the slip always opens under the trigger, clamped to the viewport.
 */
export const props = {
  /** Controlled open state (synced from the page; the trigger tap and the
      outside tap manage it internally too — mirror it with `bind:change`). */
  open: {
    type: Boolean,
    value: false,
  },
  /** The sticker chosen elsewhere: marked in the grid (check in the corner). */
  value: {
    type: String,
    value: '',
  },
  /** Offer only these — strings or { name, label?, category?, tags? }.
      Names that have not been drawn are skipped. Default: everything in the
      art library, grouped by the batch it was drawn in. */
  stickers: {
    type: null,
    optionalTypes: [Array],
    value: null,
  },
  /** Names to show first under "Recent" (unfiltered view). */
  recent: {
    type: null,
    optionalTypes: [Array],
    value: null,
  },
  /** Close after choosing. Turn off to add several in a row. */
  closeOnSelect: {
    type: Boolean,
    value: true,
  },
  /** Stickers per row (at least 1). */
  columns: {
    type: null,
    optionalTypes: [Number, String],
    value: 5,
  },
  /** Drawn size of a sticker in the grid, px. */
  size: {
    type: null,
    optionalTypes: [Number, String],
    value: 44,
  },
  placeholder: {
    type: String,
    value: 'Search stickers',
  },
  /** The slip's width in px (upstream w-[min(23rem,calc(100vw-2rem))]). */
  width: {
    type: null,
    optionalTypes: [Number, String],
    value: 343,
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};

export const validators = {
  columns: 'number',
  size: 'number',
};
