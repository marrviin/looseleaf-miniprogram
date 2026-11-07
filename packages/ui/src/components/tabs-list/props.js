/** ll-tabs-list properties — upstream `TabsList`. */
export const props = {
  variant: {
    type: String,
    value: 'default',
  },
  customStyle: String,
};

export const validators = {
  variant: ['default', 'line'],
};
