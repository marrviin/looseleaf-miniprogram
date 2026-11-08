/**
 * ll-corkboard-note properties — upstream CorkboardNote (corkboard.tsx).
 */
export const props = {
  /** Unique id; the key in the board's value. (Upstream names it `id`;
      wxml reserves `id` for the node selector, so the property is noteId.) */
  noteId: {
    type: String,
    value: '',
  },
  /** Where it starts, px from the top-left of the cork. */
  x: {
    type: null,
    optionalTypes: [Number],
    value: 16,
  },
  y: {
    type: null,
    optionalTypes: [Number],
    value: 16,
  },
  /** How it starts turned, degrees. Default a small seeded angle. */
  rotate: {
    type: null,
    optionalTypes: [Number],
    value: null,
  },
  /** What the sheet is made of (a Paper stock). */
  stock: {
    type: String,
    value: 'sticky-yellow',
  },
  /** A pin, or a strip of tape when false. */
  pinned: {
    type: Boolean,
    value: true,
  },
  /** Pin color (tomato | sky | lemon | grass | grape | tangerine); default seeded from the id. */
  pinColor: {
    type: String,
    value: '',
  },
  /** Accessible name (default the id), also used in announcements. */
  label: {
    type: String,
    value: '',
  },
  /** No sheet of its own: the children are the paper (a StickyNote, a Polaroid…). */
  bare: {
    type: Boolean,
    value: false,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
