/**
 * ll-bookmark-ribbon properties — upstream BookmarkRibbon (bookmark.tsx):
 * the ribbon with no behavior — decoration that hangs out of the top of a
 * sheet or a notebook.
 */
export const props = {
  /** Accent — the ribbon's cloth color. */
  tone: {
    type: String,
    value: 'tomato',
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
