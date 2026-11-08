/**
 * ll-dropzone-item properties — upstream DropzoneItem (dropzone.tsx).
 */
export const props = {
  /** The file: { name, size, type, path }. */
  file: {
    type: Object,
    value: null,
  },
  /** "idle" | "uploading" | "done" | "error". */
  status: {
    type: String,
    value: 'idle',
  },
  /** 0-100 while uploading; shows the highlighter line. */
  progress: {
    type: null,
    optionalTypes: [Number, String],
    value: null,
  },
  /** Shown in red when status is "error". */
  error: {
    type: String,
    value: '',
  },
  /** Preview image files (a little crooked polaroid). */
  thumbnail: {
    type: Boolean,
    value: true,
  },
  /** Name the x. */
  removeLabel: {
    type: String,
    value: '',
  },
  seed: {
    type: null,
    optionalTypes: [Number, String],
    value: '',
  },
  customStyle: String,
};
