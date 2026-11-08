export const props = {
  /** 'vertical' (label above) | 'horizontal' (label beside) |
      'responsive' (vertical here — container queries don't exist). */
  orientation: {
    type: String,
    value: 'vertical',
  },
  /** Turns the label red (upstream data-invalid). */
  invalid: {
    type: Boolean,
    value: false,
  },
  customStyle: String,
};
