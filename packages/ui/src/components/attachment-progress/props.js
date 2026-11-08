/**
 * ll-attachment-progress properties — upstream AttachmentProgress.
 * No value = indeterminate (the bar pulses instead of filling).
 */
export const props = {
  value: {
    type: null,
    optionalTypes: [Number, String],
    value: null,
  },
  max: {
    type: null,
    optionalTypes: [Number, String],
    value: 100,
  },
  seed: {
    type: null,
    optionalTypes: [Number, String],
    value: '',
  },
  customStyle: String,
};
