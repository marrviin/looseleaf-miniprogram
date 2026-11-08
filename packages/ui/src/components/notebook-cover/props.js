/**
 * ll-notebook-cover properties — upstream NotebookCover (notebook.tsx):
 * the cover of a closed notebook, for a shelf or a library. 176 × 240px
 * (h-60 w-44).
 */
export const props = {
  /** The cloth: 'tomato', 'ink' (black), or any accent. */
  tone: {
    type: String,
    value: 'tomato',
  },
  /** The elastic band. */
  band: {
    type: null,
    optionalTypes: [Boolean],
    value: true,
  },
  /** true = seeded turn under 1.4deg; number = degrees; false = flat. */
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
  ariaLabel: String,
  customStyle: String,
};
