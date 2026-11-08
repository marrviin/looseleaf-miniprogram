/**
 * ll-typography-list properties — upstream typography List.
 *
 * Deviation: upstream takes slotted <li> elements; an isolated WeChat
 * component can't style page-side children, so the items come in as an
 * array of strings (rich text is out of scope here).
 */
export const props = {
  ordered: {
    type: Boolean,
    value: false,
  },
  items: {
    type: Array,
    value: [],
  },
  customStyle: String,
};
