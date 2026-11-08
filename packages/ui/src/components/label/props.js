export const props = {
  /** Draw the red pencil star after the text (upstream required). */
  required: {
    type: Boolean,
    value: false,
  },
  /** Controlled dim (upstream dims via peer/group selectors, which don't
      exist here — the page passes disabled when its control is disabled). */
  disabled: {
    type: Boolean,
    value: false,
  },
  /** id of the associated native form control (native label `for`). */
  for: {
    type: String,
    value: '',
  },
  customStyle: String,
};
