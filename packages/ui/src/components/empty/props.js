export const props = {
  /** Pins the hand of the frame (upstream seed → useId when empty). */
  seed: {
    type: String,
    value: '',
  },
  /** Upstream asks for the sketched dashed placeholder frame by putting
      `border` in className (a React-only channel); here it is an explicit
      `framed` property — with it the CSS border becomes the empty-frame
      ink recipe, without it nothing is drawn. */
  framed: {
    type: Boolean,
    value: false,
  },
  customStyle: String,
};

export const validators = {
  framed: [true, false, 'true', 'false'],
};
