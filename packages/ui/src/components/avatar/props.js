export const props = {
  size: {
    type: String,
    value: 'default',
  },
  ring: {
    type: String,
    value: 'ink',
  },
  customStyle: String,
};

export const validators = {
  size: ['sm', 'default', 'lg', 'xl'],
  ring: ['ink', 'you', 'marker', 'none'],
};
