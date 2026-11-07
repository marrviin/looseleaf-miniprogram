/**
 * ll-bookmark properties — upstream Bookmark (bookmark.tsx): a cloth ribbon
 * bookmark that is a toggle button — a whisper pencil ghost at rest, the
 * woven ribbon when pressed. (Upstream's sr-only children become the
 * `label` property here — WeChat has no visually-hidden text flow inside a
 * virtualHost button.)
 */
export const props = {
  /** Accent — the ribbon's cloth color. */
  tone: {
    type: String,
    value: 'tomato',
  },
  /** The toggle state (upstream Radix `pressed`): on = the ribbon. Fires
      `change` with {pressed} when tapped. */
  pressed: {
    type: Boolean,
    value: false,
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  /** Accessible name (upstream's sr-only children). */
  label: {
    type: String,
    value: 'Bookmark',
  },
  /** true = seeded tilt (max 1.4deg); number = degrees; false = flat. */
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
  tone: ['tomato', 'tangerine', 'lemon', 'grass', 'teal', 'sky', 'grape', 'bubblegum'],
};
