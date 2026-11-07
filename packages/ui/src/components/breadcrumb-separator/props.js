/** ll-breadcrumb-separator properties — the mark between two crumbs.
    A hand-drawn slash by default; `icon` swaps in another drawn glyph
    (chevron-right, arrow-right, dot…), or set icon='' to use the slot. */
export const props = {
  icon: {
    type: String,
    value: 'slash',
  },
  iconSize: {
    type: null,
    optionalTypes: [String, Number],
    value: 16,
  },
  customStyle: String,
};

export const validators = {};
