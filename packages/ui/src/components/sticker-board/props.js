/**
 * ll-sticker-board properties — upstream StickerBoard + Canvas + Toolbar
 * folded into one component. Selection is always internal (upstream also
 * allows a controlled selectedId): tap a sticker to pick it, tap the bare
 * page to let go; mirror it with `bind:selectedchange`.
 */
export const props = {
  /** StickerBoardItem[] — controlled. x/y are the center of the visible
      sticker in px from the canvas's top-left; rot degrees clockwise;
      scale 1 is the drawn size; a higher z lies on top. JSON that lacks
      rot/scale/z is mended on the way in (0, 1, its list position). */
  value: {
    type: null,
    optionalTypes: [Array],
    value: null,
  },
  /** Uncontrolled starting set. */
  defaultValue: {
    type: null,
    optionalTypes: [Array],
    value: null,
  },
  /** Drawn size of a sticker at scale 1, px. */
  size: {
    type: null,
    optionalTypes: [Number, String],
    value: 96,
  },
  minScale: {
    type: null,
    optionalTypes: [Number, String],
    value: 0.3,
  },
  maxScale: {
    type: null,
    optionalTypes: [Number, String],
    value: 3,
  },
  /** '"center" | "inside" | "none"' — where a sticker may go. */
  bounds: {
    type: String,
    value: 'center',
  },
  /** Look but do not touch: no handles, no toolbar actions. */
  readOnly: {
    type: Boolean,
    value: false,
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  /** Accessible name of the canvas group. */
  label: {
    type: String,
    value: 'Sticker board',
  },
  /** What the empty board says. */
  empty: {
    type: String,
    value: 'Nothing stuck down yet.',
  },
  /** The page stock (upstream Paper stock prop of the canvas). */
  canvasStock: {
    type: String,
    value: 'dot-grid',
  },
  /** Canvas height (any CSS length, e.g. "480px"); default is the CSS
      min-height 576rpx. Upstream sizes the canvas with utility classes. */
  canvasHeight: {
    type: String,
    value: '',
  },
  /** Toolbar groups, in order: turn | size | layer | duplicate | delete |
      export. Default: all. */
  actions: {
    type: null,
    optionalTypes: [Array],
    value: null,
  },
  customStyle: String,
};

export const validators = {
  bounds: ['center', 'inside', 'none'],
};
