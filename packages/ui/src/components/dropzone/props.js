/**
 * ll-dropzone properties — upstream Dropzone (dropzone.tsx).
 */
export const props = {
  /** What the picker offers and accepts: "image/*,.pdf" — comma separated. */
  accept: {
    type: String,
    value: '',
  },
  /** false: one file, a new pick replaces the old. */
  multiple: {
    type: Boolean,
    value: true,
  },
  /** How many files in all. */
  maxFiles: {
    type: null,
    optionalTypes: [Number, String],
    value: null,
  },
  /** Size limits in bytes. */
  maxSize: {
    type: null,
    optionalTypes: [Number, String],
    value: null,
  },
  minSize: {
    type: null,
    optionalTypes: [Number, String],
    value: null,
  },
  /** Pale stitches, nothing happens. */
  disabled: {
    type: Boolean,
    value: false,
  },
  /** Red stitches on a pink wash. */
  invalid: {
    type: Boolean,
    value: false,
  },
  seed: {
    type: null,
    optionalTypes: [Number, String],
    value: '',
  },
  customStyle: String,
};
