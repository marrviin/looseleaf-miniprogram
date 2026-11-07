/**
 * ll-navigation-menu properties.
 * API aligned with upstream looseleaf NavigationMenu (Radix root).
 */
export const props = {
  /** Which item is open ('' = nothing). */
  value: {
    type: String,
    value: '',
  },
  defaultValue: {
    type: String,
    value: '',
  },
  /** true = one shared slip under the strip (resized to the open panel);
      false = each panel is a slip of its own under its tab. */
  viewport: {
    type: Boolean,
    value: true,
  },
  /** Accessibility label (the root is a nav landmark). */
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};
