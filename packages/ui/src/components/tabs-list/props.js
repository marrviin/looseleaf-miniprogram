/** ll-tabs-list properties — upstream `TabsList`. */
export const props = {
  variant: {
    type: String,
    value: 'default',
  },
  /** Platform extension: false = the ink recipe omits the shared baseline
      rule (bottom nav bars / floating tabs); per-tab outlines stay. */
  baseline: {
    type: Boolean,
    value: true,
  },
  customStyle: String,
};

export const validators = {
  variant: ['default', 'line'],
};
