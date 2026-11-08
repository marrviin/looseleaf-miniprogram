/**
 * ll-alert properties — upstream Alert (alert.tsx).
 */
export const props = {
  /** 'default' | 'destructive' | 'info' | 'success' | 'warning' | 'note'. */
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
