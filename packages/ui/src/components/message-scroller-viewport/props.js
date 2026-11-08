/**
 * ll-message-scroller-viewport properties — upstream MessageScrollerViewport:
 * the scrolling element (a labeled region).
 */
export const props = {
  /** Hold the message you are reading still when older messages are added
      above (upstream behavior; not portable to scroll-view — noted). */
  preserveScrollOnPrepend: {
    type: Boolean,
    value: true,
  },
  customStyle: String,
};
