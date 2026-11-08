/** ll-sidebar properties — upstream `Sidebar`. */
export const props = {
  /** '"left" | "right"' — which edge it hangs on. */
  side: {
    type: String,
    value: 'left',
  },
  /** '"sidebar" | "floating" | "inset"' — docked / set down on the desk /
      page-as-sheet. */
  variant: {
    type: String,
    value: 'sidebar',
  },
  /** '"offcanvas" | "icon" | "none"' — slide away, shrink to icons, never. */
  collapsible: {
    type: String,
    value: 'offcanvas',
  },
  /** What the pad is made of (Paper stock; upstream default "pad"). */
  stock: {
    type: String,
    value: 'pad',
  },
  /** The binder clip at the top. Unset = auto (drawn unless
      collapsible="none"); false removes it; true forces it on. */
  clip: {
    type: null,
    optionalTypes: [Boolean],
    value: null,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  /** Port escape hatch: render the docked pad even on a phone, and anchor
      it to the nearest positioned ancestor instead of the viewport (the
      upstream desktop pad is viewport-fixed; the docs demo frames contain
      it with overflow-hidden + a transform, which a miniprogram frame
      cannot do). Demo pages set this; apps leave it off and get the real
      behavior: sheet on phones, fixed pad on wide windows. */
  static: {
    type: Boolean,
    value: false,
  },
  /** Paper shadow for the static docked + collapsible="none" pads ('stock'
      default = the sheet shadow; 'none' flushes them onto the desk). The
      floating sheet branch keeps the Sheet's own shadow. */
  paperShadow: {
    type: String,
    value: 'stock',
  },
  customStyle: String,
};

export const validators = {
  side: ['left', 'right'],
  variant: ['sidebar', 'floating', 'inset'],
  collapsible: ['offcanvas', 'icon', 'none'],
};
