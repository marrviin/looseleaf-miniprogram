/**
 * ll-ribbon properties — upstream Ribbon (ribbon.tsx).
 */
export const props = {
  /** Folded swallow-tailed ends; a V notch at both ends; square at the start. */
  variant: {
    type: String,
    value: 'banner',
  },
  /** The paper. Marker, hi, tangerine, lemon, grass, teal, sky, bubblegum, paper. */
  tone: {
    type: String,
    value: 'marker',
  },
  /** Band height 26 / 34 / 46 px with 14 / 16 / 20 px type. */
  size: {
    type: String,
    value: 'default',
  },
  /** Upstream asChild/onClick/href: a ribbon that lifts on hover and takes
      the drawn hover layer (underline + drop-line). Tap triggers a `tap` event. */
  interactive: {
    type: Boolean,
    value: false,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  ariaLabel: String,
  customStyle: String,
};

export const validators = {
  variant: ['banner', 'swallow', 'flag'],
  tone: ['marker', 'hi', 'tangerine', 'lemon', 'grass', 'teal', 'sky', 'bubblegum', 'paper'],
  size: ['sm', 'default', 'lg'],
};
