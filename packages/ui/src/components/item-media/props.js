/** ll-item-media properties — upstream `ItemMedia` (the leading/trailing
    picture). `icon` = 36px well with a ruled pencil box; `image` = 40px
    photograph on a white border, lying a degree crooked (alternating rows). */
export const props = {
  variant: {
    type: String,
    value: 'default',
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};

export const validators = {
  variant: ['default', 'icon', 'image'],
};
