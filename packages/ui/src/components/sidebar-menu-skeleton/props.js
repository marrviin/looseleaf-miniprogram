/** ll-sidebar-menu-skeleton properties — upstream `SidebarMenuSkeleton`. */
export const props = {
  /** A square for the icon. */
  showIcon: {
    type: Boolean,
    value: false,
  },
  /** Pins the width (50–90%), so the same seed always hatches the same. */
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};

export const validators = {};
