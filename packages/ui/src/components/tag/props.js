/**
 * ll-tag properties — upstream LabelTag (label-tag.tsx).
 */
export const props = {
  /** Paper stock (drawn inside the sheet recipe). */
  stock: {
    type: String,
    value: 'kraft',
  },
  shape: {
    type: String,
    value: 'default', // upstream default: price
  },
  /** Twine length in px; the layout reserves it (margin) and the recipe draws it. */
  string: {
    type: Number,
    value: 36,
  },
  twine: {
    type: String,
    value: 'natural',
  },
  eyelet: {
    type: String,
    value: 'brass',
  },
  /** true = seed-derived swing (max 2deg); number = explicit degrees; false = none. */
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

export const validators = {
  stock: ['kraft', 'paper', 'index-card', 'sticky-yellow', 'sticky-pink'],
  shape: ['default', 'price', 'round', 'luggage'],
  twine: ['natural', 'tomato', 'grass', 'sky', 'grape'],
  eyelet: ['brass', 'steel', 'none'],
};
