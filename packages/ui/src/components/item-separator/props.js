/** ll-item-separator properties — upstream `ItemSeparator` (a Separator).
    The default pencil line is a CSS mask like the rows'; any other variant
    (dashed, wavy, tape...) is a real Separator with a drawing of its own. */
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
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};

export const validators = {
  variant: ['pencil', 'dashed', 'wavy', 'dotted', 'tape', 'stitched', 'torn'],
  orientation: ['horizontal', 'vertical'],
};
