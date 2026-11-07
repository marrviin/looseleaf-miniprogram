export const props = {
  /** `icon` = a 44px slip of paper with a hatched shadow (empty-media recipe);
      `default` leaves the media bare for anything (an avatar, a group…). */
  variant: {
    type: String,
    value: 'default',
  },
  /** Stubby's pose — mascot map key (search/sleep/unplug/shrug…); unknown
      poses render nothing, like upstream. */
  pose: {
    type: String,
    value: '',
  },
  /** A doodle by name (paper-plane, cat-face, balloon…). */
  doodle: {
    type: String,
    value: '',
  },
  /** Pixels tall. Stubby defaults to 96, doodles to 80. */
  size: {
    type: String,
    optionalTypes: [Number],
    value: '',
  },
  seed: {
    type: String,
    value: '',
  },
  customStyle: String,
};

export const validators = {
  variant: ['default', 'icon'],
};
