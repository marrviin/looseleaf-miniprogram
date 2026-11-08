/** ll-sidebar-menu-action properties — upstream `SidebarMenuAction`. */
export const props = {
  /** Upstream reveals it on row hover (always visible on touch — which is
      what a miniprogram is), so this prop only feeds API fidelity. */
  showOnHover: {
    type: Boolean,
    value: false,
  },
  ariaLabel: String,
  customStyle: String,
};

export const validators = {};
