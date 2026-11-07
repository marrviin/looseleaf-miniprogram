export const props = {
  name: {
    type: String,
    value: '',
  },
  tone: {
    type: String,
    value: '',
  },
  customStyle: String,
};

export const validators = {
  tone: ['tomato', 'tangerine', 'lemon', 'grass', 'teal', 'sky', 'grape', 'bubblegum'],
};
