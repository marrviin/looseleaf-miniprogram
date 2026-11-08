/** ll-sidebar-menu-sub-button properties — upstream `SidebarMenuSubButton`. */
export const props = {
  /** Marks the current page: bold on the highlighter. */
  isActive: {
    type: Boolean,
    value: false,
  },
  /** '"sm" | "md"' — 15 or 16 px text. */
  size: {
    type: String,
    value: 'md',
  },
  ariaLabel: String,
  customStyle: String,
};

export const validators = {
  size: ['sm', 'md'],
};
