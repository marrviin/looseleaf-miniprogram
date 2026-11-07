/** ll-button-group properties — upstream `ButtonGroup` (role=group row/column). */
export const props = {
  orientation: {
    type: String,
    value: 'horizontal',
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};

export const validators = {
  orientation: ['horizontal', 'vertical'],
};
