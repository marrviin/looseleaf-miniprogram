/**
 * ll-marker properties — upstream Marker (marker.tsx): a separator, a border
 * or a plain line of small print.
 */
export const props = {
  /** 'default' | 'separator' | 'border' — where the line goes. */
  variant: {
    type: String,
    value: 'default',
  },
  /** 'default' | 'new' — new pulls the lines in red pencil, sets the words
      bold on a highlighter swipe and reddens a MarkerIcon: the unread
      marker. */
  tone: {
    type: String,
    value: 'default',
  },
  /** 'line' | 'wavy' — how a border marker's line is drawn. */
  rule: {
    type: String,
    value: 'line',
  },
  /** Pins the hand of the lines. */
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
