/** options: addon/control components dropped in the slot. The group only
    carries the drawn box — its focus/invalid/disabled layers follow the
    control, which reports through the ancestor relation. */
export const props = {
  /** Group-level kill switch (upstream data-disabled="true"). */
  disabled: {
    type: Boolean,
    value: false,
  },
  /** Group-level invalid (upstream data-invalid="true"). */
  invalid: {
    type: Boolean,
    value: false,
  },
  customStyle: String,
};
