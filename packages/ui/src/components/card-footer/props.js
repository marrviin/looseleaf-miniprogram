/** ll-card-footer properties — same rule semantics as the header. */
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
