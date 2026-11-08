/** ll-sidebar-menu-button properties — upstream `SidebarMenuButton`. */
export const props = {
  /** Marks the current page: bold, highlighter, margin bracket. */
  isActive: {
    type: Boolean,
    value: false,
  },
  /** '"default" | "outline"' — outline adds a pencil box. */
  variant: {
    type: String,
    value: 'default',
  },
  /** '"default" | "sm" | "lg"' — 32, 28 or 48 px high. */
  size: {
    type: String,
    value: 'default',
  },
  /** Optional page to open on tap (upstream wraps a Link with asChild —
      here the row can navigate itself). */
  url: {
    type: String,
    value: '',
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  /** Upstream shows this in a tooltip when the pad is collapsed to icons on
      a desktop window; the miniprogram tooltip can't anchor inside a
      collapsed 3rem strip, so it is accepted for API fidelity only. */
  tooltip: {
    type: String,
    value: '',
  },
  ariaLabel: String,
  customStyle: String,
};

export const validators = {
  variant: ['default', 'outline'],
  size: ['default', 'sm', 'lg'],
};
