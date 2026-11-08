/**
 * ll-dropzone-area properties — upstream DropzoneArea (dropzone.tsx).
 */
export const props = {
  /** Pins the hand: the same seed always sews the same patch. */
  seed: {
    type: null,
    optionalTypes: [Number, String],
    value: '',
  },
  customStyle: String,
};
