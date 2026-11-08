/**
 * ll-message-scroller-item properties — upstream MessageScrollerItem.
 */
export const props = {
  /** Stable id for scrollToMessage (upstream messageId; `scrollAnchor`
      messages get pinned to the top when they arrive). */
  messageId: {
    type: String,
    value: '',
  },
  scrollAnchor: {
    type: Boolean,
    value: false,
  },
  customStyle: String,
};
