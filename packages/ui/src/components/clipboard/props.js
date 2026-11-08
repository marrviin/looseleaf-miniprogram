/**
 * ll-clipboard properties — upstream Clipboard (clipboard.tsx): a shaped
 * sheet drawn by clipboard-board-ink (hardboard grain or a plastic accent)
 * with a metal clip on top, holding one sheet of paper (ClipboardPaper
 * folds in as the wrapped slot).
 */
export const props = {
  /** BoardTone — 'hardboard' or an accent (plastic board). */
  tone: {
    type: String,
    value: 'hardboard',
  },
  /** The sheet's stock (upstream ClipboardPaper stock). */
  stock: {
    type: String,
    value: 'paper',
  },
  /** Rules kind on the sheet (upstream ClipboardPaper rules). */
  rules: {
    type: String,
    value: 'ruled',
  },
  /** Paper passthrough — see ll-paper. */
  tilt: {
    type: null,
    optionalTypes: [Boolean, Number, String],
    value: true,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  ariaLabel: String,
  customStyle: String,
};
