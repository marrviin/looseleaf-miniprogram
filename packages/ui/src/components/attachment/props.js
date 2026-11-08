/**
 * ll-attachment properties — upstream Attachment (attachment.tsx).
 */
export const stateList = ['idle', 'uploading', 'processing', 'error', 'done'];

export const props = {
  /** AttachmentState — idle | uploading | processing | error | done. */
  state: {
    type: String,
    value: 'done',
  },
  /** 'default' | 'sm' | 'xs'. */
  size: {
    type: String,
    value: 'default',
  },
  /** 'horizontal' (a slip) | 'vertical' (a taped photo). */
  orientation: {
    type: String,
    value: 'horizontal',
  },
  seed: {
    type: null,
    optionalTypes: [Number, String],
    value: '',
  },
  customStyle: String,
};
