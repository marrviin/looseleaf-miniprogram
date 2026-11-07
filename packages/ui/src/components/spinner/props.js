export const props = {
  variant: {
    type: String,
    value: 'scribble',
  },
  /** px; default 16, 64 for the write variant. */
  size: {
    type: null,
    optionalTypes: [Number, String],
    value: null,
  },
  seed: {
    type: null,
    optionalTypes: [Number, String],
    value: null,
  },
  /** Platform extension: upstream draws in the parent's text color via
      currentColor; backgrounds can't inherit it (see ll-icon). */
  ink: {
    type: String,
    value: '',
  },
  ariaLabel: {
    type: String,
    value: 'Loading',
  },
  customStyle: String,
};

export const validators = {
  variant: ['scribble', 'loops', 'write'],
};
