/**
 * ll-arrow properties — upstream Arrow (arrow.tsx).
 */
export const props = {
  /** ArrowDirection — right/left/up/down or a diagonal like 'down-right'. */
  direction: {
    type: String,
    value: 'right',
  },
  /** ArrowCurve — 'straight' | 'curved' | 'wave'... */
  curve: {
    type: String,
    value: 'straight',
  },
  /** ArrowHead — 'v' | 'barb' | 'arrow' | 'none'... */
  head: {
    type: String,
    value: 'v',
  },
  /** MarkPen tone — 'ink' | 'blue' | 'red' | 'marker' | 'pencil'... */
  tone: {
    type: String,
    value: 'ink',
  },
  /** 'regular' | 'fine' | 'brush'. */
  weight: {
    type: String,
    value: 'regular',
  },
  /** Which way the curve bows. */
  bend: {
    type: String,
    value: 'up',
  },
  /** Aim at a page selector (e.g. '#target') instead of flying a fixed
      direction; the arrow is sized to the vector. Measured once when ready
      (no ResizeObserver in the webview — re-aim by re-setting the prop). */
  pointAt: {
    type: String,
    value: '',
  },
  /** Distance kept from the target box when aiming. */
  gap: {
    type: null,
    optionalTypes: [Number, String],
    value: 6,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
