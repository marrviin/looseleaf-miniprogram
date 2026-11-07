/**
 * ll-toggle-group properties.
 * API aligned with upstream looseleaf ToggleGroup (Radix single/multiple).
 */
export const props = {
  /** single = at most one item on (radio semantics); multiple = any number. */
  type: {
    type: String,
    value: 'multiple',
  },
  /** Joined groups (spacing 0) with variant outline share one drawn box. */
  variant: {
    type: String,
    value: '',
  },
  size: {
    type: String,
    value: '',
  },
  /** Gap between items in 4px units (upstream spacing scale); 0 joins them. */
  spacing: {
    type: Number,
    value: 0,
  },
  /** Body color of an on item: 'hi' | 'marker'. */
  tone: {
    type: String,
    value: '',
  },
  orientation: {
    type: String,
    value: 'horizontal',
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  /** Draws the shared box (or each item's box) in red pencil. */
  invalid: {
    type: Boolean,
    value: false,
  },
  /** Selected value(s): a string for single, a string[] for multiple. */
  value: {
    type: null,
    optionalTypes: [String, Array],
  },
  defaultValue: {
    type: null,
    optionalTypes: [String, Array],
  },
  /** Accessibility label (the group is announced as one control). */
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};

/** Validation lists, consumed by docs generation and unit tests. */
export const validators = {
  type: ['single', 'multiple'],
  variant: ['default', 'outline'],
  size: ['default', 'sm', 'lg'],
  orientation: ['horizontal', 'vertical'],
};
