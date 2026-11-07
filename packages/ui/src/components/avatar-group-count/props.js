export const props = {
  size: {
    type: String,
    value: 'default',
  },
  customStyle: String,
};

export const validators = {
  size: ['sm', 'default', 'lg', 'xl'],
};
