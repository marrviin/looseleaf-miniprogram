export const props = {
  /** All Button variants work; ghost by default (upstream InputGroupButton). */
  variant: {
    type: String,
    value: 'ghost',
  },
  /** '"xs" | "sm" | "icon-xs" | "icon-sm"' (plus Button's own sizes). */
  size: {
    type: String,
    value: 'xs',
  },
  shape: {
    type: String,
    value: 'default',
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  loading: {
    type: Boolean,
    value: false,
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};
