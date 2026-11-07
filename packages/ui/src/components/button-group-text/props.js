/** ll-button-group-text properties — upstream `ButtonGroupText` (a printed
    cell in the row: paper-shade body under an ink box, hand-font text). */
export const props = {
  /** Pins the hand of this cell. */
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  /** Seam trim inside a button-group (a ready clip-path string). */
  trimStyle: {
    type: String,
    value: '',
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};

export const validators = {};
