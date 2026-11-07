export const props = {
  variant: {
    type: String,
    value: 'pencil',
  },
  orientation: {
    type: String,
    value: 'horizontal',
  },
  decorative: {
    type: Boolean,
    value: true,
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};

export const validators = {
  variant: ['pencil', 'dashed', 'wavy', 'dotted', 'tape', 'stitched', 'torn'],
  orientation: ['horizontal', 'vertical'],
};
