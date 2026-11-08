/**
 * ll-attachment-media properties — upstream AttachmentMedia.
 */
export const props = {
  /** 'icon' (a wash blob behind the icon) | 'image' (a photo tile). */
  variant: {
    type: String,
    value: 'icon',
  },
  seed: {
    type: null,
    optionalTypes: [Number, String],
    value: '',
  },
  customStyle: String,
};
