/**
 * ll-folder properties — upstream Folder (folder.tsx): the Tabs root.
 * `dir`/`activationMode` are not portable (no RTL, tap only).
 */
export const props = {
  /** What tabs and body are made of: 'kraft' (manila), 'sticky-yellow',
      'paper', 'index-card' ... */
  stock: {
    type: String,
    value: 'kraft',
  },
  /** The open tab's value (controlled). */
  value: {
    type: String,
    value: '',
  },
  /** Start value (uncontrolled). */
  defaultValue: {
    type: String,
    value: '',
  },
  customStyle: String,
};
