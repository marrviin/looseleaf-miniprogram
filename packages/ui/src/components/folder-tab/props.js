/**
 * ll-folder-tab properties — upstream FolderTab (folder.tsx).
 * A tab in the folder's top strip; its ink (the tab shape) is drawn by
 * `folderTabRecipe`.
 */
export const props = {
  /** Identity; matches the folder-content that opens with it. */
  value: String,
  label: String,
  /** Disabled tabs keep their shape but are redrawn in pencil-dashed ink. */
  disabled: Boolean,
  ariaLabel: String,
  customStyle: String,
};
