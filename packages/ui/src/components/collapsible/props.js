/**
 * ll-collapsible properties — upstream Collapsible (radix root).
 */
export const props = {
  /** Controlled open state. */
  open: {
    type: null,
    optionalTypes: [Boolean, String],
    value: false,
  },
  /** Uncontrolled initial state (used until `open` is set). */
  defaultOpen: {
    type: null,
    optionalTypes: [Boolean, String],
    value: false,
  },
  customStyle: String,
};
