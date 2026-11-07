/** ll-accordion properties — upstream `Accordion` (Radix root).
    `value` is the row id (single) or an array of them (multiple). */
export const props = {
  type: {
    type: String,
    value: 'single',
  },
  collapsible: {
    type: Boolean,
    value: false,
  },
  value: {
    type: null,
    optionalTypes: [String, Array],
    value: '',
  },
  defaultValue: {
    type: null,
    optionalTypes: [String, Array],
    value: '',
  },
  /** The margin mark of an opened row: 'curly' | 'square' | 'none' (false). */
  bracket: {
    type: String,
    value: 'curly',
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  customStyle: String,
};

export const validators = {
  type: ['single', 'multiple'],
  bracket: ['curly', 'square', 'none'],
};
