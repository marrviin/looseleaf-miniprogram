export const props = {
  /** Wrap a whole Field: the label becomes a hand-drawn choice card
      (field-choice ink) — upstream FieldLabel `card` / inferred from a
      Field child. */
  card: {
    type: Boolean,
    value: false,
  },
  /** Card mode: the checked card gets the highlighter wash + felt box
      (controlled — the page owns the radio/checkbox state). */
  checked: {
    type: Boolean,
    value: false,
  },
  required: {
    type: Boolean,
    value: false,
  },
  /** Controlled dim + red (upstream group-data-[disabled]/data-invalid
      selectors, which don't exist here). */
  disabled: {
    type: Boolean,
    value: false,
  },
  invalid: {
    type: Boolean,
    value: false,
  },
  for: {
    type: String,
    value: '',
  },
  customStyle: String,
};
