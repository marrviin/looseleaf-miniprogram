/**
 * ll-message-scroller properties — upstream MessageScroller + Provider
 * (message-scroller.tsx / message-scroller-primitive.tsx): the scrolling
 * transcript of a chat. The provider renders no element upstream; here the
 * root is both.
 */
export const props = {
  /** Follow the bottom while content grows, until the person scrolls up. */
  autoScroll: {
    type: Boolean,
    value: false,
  },
  /** Where a conversation opens: 'start' | 'end'. */
  defaultScrollPosition: {
    type: String,
    value: 'end',
  },
  /** How close to an edge counts as being at it, px. */
  scrollEdgeThreshold: {
    type: null,
    optionalTypes: [Number],
    value: 8,
  },
  /** Accessible name of the region. */
  label: {
    type: String,
    value: 'Messages',
  },
  customStyle: String,
};
