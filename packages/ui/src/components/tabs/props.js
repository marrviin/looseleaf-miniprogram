/** ll-tabs properties — upstream `Tabs` (Radix root).
    activationMode is automatic only in the miniprogram (no keyboard focus). */
export const props = {
  value: {
    type: String,
    value: '',
  },
  defaultValue: {
    type: String,
    value: '',
  },
  orientation: {
    type: String,
    value: 'horizontal',
  },
  customStyle: String,
  ariaLabel: {
    type: String,
    value: '',
  },
};

export const validators = {
  orientation: ['horizontal', 'vertical'],
};
