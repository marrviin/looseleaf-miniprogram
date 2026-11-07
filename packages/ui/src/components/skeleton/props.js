export const props = {
  /** Pins the boil phase (upstream seed → useId when empty). */
  seed: {
    type: String,
    value: '',
  },
  /** Upstream `rounded-full` — the outline becomes a hand-looped circle. */
  round: {
    type: Boolean,
    value: false,
  },
  customStyle: String,
};

export const validators = {
  round: [true, false, 'true', 'false'],
};
