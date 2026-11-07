/**
 * ll-card-header properties. Upstream draws the rule when the header carries
 * a border-b class; miniprogram styles are isolated, so it is an explicit
 * prop ('pencil' | 'dashed' | 'wavy').
 */
export const props = {
  rule: {
    type: String,
    value: 'none',
  },
  customStyle: String,
};

export const validators = {
  rule: ['none', 'pencil', 'dashed', 'wavy'],
};
