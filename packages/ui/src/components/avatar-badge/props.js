export const props = {
  status: {
    type: String,
    value: 'marker',
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};

export const validators = {
  status: ['online', 'away', 'busy', 'offline', 'marker'],
};
