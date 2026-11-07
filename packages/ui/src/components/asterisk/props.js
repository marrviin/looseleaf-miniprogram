/**
 * ll-asterisk properties — upstream Asterisk (<span> wrapper): a hand-drawn
 * footnote glyph after the words, raised like a superscript.
 */
export const props = {
  /** 'asterisk' | 'star' | 'dagger' | 'double-dagger'. */
  mark: {
    type: String,
    value: 'asterisk',
  },
  /** 'red' | 'ink' | 'blue' | 'pencil' — the pen. */
  tone: {
    type: String,
    value: 'red',
  },
  /** Accessible name; without it the glyph is aria-hidden. */
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
  mark: ['asterisk', 'star', 'dagger', 'double-dagger'],
  tone: ['red', 'ink', 'blue', 'pencil'],
};
