/** ll-item properties — upstream `Item` (variant/size/seed). `link` stands
    in for React's `asChild <a>`: a link row is one big hit area that wears
    the highlighter swipe while the finger is down. */
export const props = {
  variant: {
    type: String,
    value: 'default',
  },
  size: {
    type: String,
    value: 'default',
  },
  link: {
    type: Boolean,
    value: false,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};

export const validators = {
  variant: ['default', 'outline', 'muted'],
  size: ['default', 'sm'],
};
