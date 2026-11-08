/** ll-sidebar-provider properties — upstream `SidebarProvider`. */
export const props = {
  /** Initial desktop state when uncontrolled (upstream restores it from the
      sidebar_state cookie; we use a storage key with the same name). */
  defaultOpen: {
    type: Boolean,
    value: true,
  },
  /** Controlled desktop open state (uncontrolled when null). */
  open: {
    type: null,
    optionalTypes: [Boolean],
    value: null,
  },
  customStyle: String,
};

export const validators = {};
