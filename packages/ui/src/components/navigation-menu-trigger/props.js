export const props = {
  // Open-state key; defaults to `item-<index>` of the parent item.
  value: {
    type: String,
    value: '',
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: {
    type: String,
    value: '',
  },
};
