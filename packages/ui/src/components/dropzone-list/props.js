/**
 * ll-dropzone-list properties — upstream DropzoneList (dropzone.tsx).
 */
export const props = {
  /** Page-driven rows: pass the files yourself and lay the items out as
      children (statuses and progress are yours); left unset the list
      renders a plain DropzoneItem per file it is pushed. */
  files: {
    type: null,
    optionalTypes: [Array],
    value: null,
  },
  customStyle: String,
};
