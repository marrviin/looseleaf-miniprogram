/** ll-button-group-separator properties — upstream `ButtonGroupSeparator`
    (a Separator, pencil + vertical by default, stretched to the group). */
export const props = {
  variant: {
    type: String,
    value: 'pencil',
  },
  orientation: {
    type: String,
    value: 'vertical',
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
