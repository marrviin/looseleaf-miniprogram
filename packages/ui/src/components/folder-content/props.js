/**
 * ll-folder-content properties — upstream FolderContent (folder.tsx).
 * The folder's body: a sheet of the folder's stock behind the open tab.
 */
export const props = {
  /** Identity; matches the folder-tab that opens this panel. */
  value: String,
  /** Draw a horizontal fold crease across the body. */
  crease: {
    type: null,
    optionalTypes: [String, Boolean],
    value: false,
  },
  /** Skip the panel mount animation (kept for API parity; not portable). */
  forceMount: Boolean,
  /** Ink seed and sheet furniture, passed straight to the paper. */
  seed: String,
  tape: String,
  fastener: String,
  fastenerTone: String,
  customStyle: String,
};
