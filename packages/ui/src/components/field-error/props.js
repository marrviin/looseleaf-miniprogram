export const props = {
  /** [{ message }] — one message renders as text, several as a list,
      duplicates collapse (upstream FieldError errors). Empty renders
      nothing. */
  errors: {
    type: Array,
    value: [],
  },
  customStyle: String,
};
