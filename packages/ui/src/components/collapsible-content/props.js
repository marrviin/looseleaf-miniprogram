/**
 * ll-collapsible-content properties — upstream CollapsibleContent.
 */
export const props = {
  /** Margin bracket drawn inside the fold: 'square' | 'curly' | false. */
  bracket: {
    type: null,
    optionalTypes: [String, Boolean],
    value: false,
  },
  customStyle: String,
};
