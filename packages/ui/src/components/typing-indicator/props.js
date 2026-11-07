export const props = {
  /** dots = three felt dots and a hopping pencil; squiggle = a cursive
      scrawl revealed left to right with a walking pencil. */
  variant: {
    type: String,
    value: 'dots',
  },
  /** Felt color: ink (black) or you (blue, the other side of the chat). */
  pen: {
    type: String,
    value: 'ink',
  },
  /** Stubby's pencil rides along unless asked not to. */
  pencil: {
    type: Boolean,
    value: true,
  },
  /** Paused: keeps the box (and the sr-only label) but draws nothing —
      toggling it announces via the region's aria-live. */
  active: {
    type: Boolean,
    value: true,
  },
  label: {
    type: String,
    value: 'Typing',
  },
  seed: {
    type: String,
    value: '',
  },
  customStyle: String,
};

export const validators = {
  variant: ['dots', 'squiggle'],
  pen: ['ink', 'you'],
  pencil: [true, false, 'true', 'false'],
  active: [true, false, 'true', 'false'],
};
