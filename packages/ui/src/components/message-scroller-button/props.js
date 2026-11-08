/**
 * ll-message-scroller-button properties — upstream MessageScrollerButton:
 * the jump button; awake when there is more to scroll in its direction.
 */
export const props = {
  /** Which way it jumps. */
  direction: {
    type: String,
    value: 'end',
  },
  variant: {
    type: String,
    value: 'secondary',
  },
  size: {
    type: String,
    value: 'icon-sm',
  },
  /** Accessibility label (default "Scroll to end" / "Scroll to start"). */
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};
