/**
 * ll-callout properties — upstream Callout (callout.tsx): Handwritten words
 * with an Arrow on their tail. `animate`/`delay` live upstream in the mark
 * phase + arrow reveal; this port draws the arrow statically, so they are
 * not exposed.
 */
export const props = {
  /** ArrowDirection — right/left/up/down or a diagonal like 'down-right'. */
  direction: {
    type: String,
    value: 'left',
  },
  /** ArrowCurve — 'straight' | 'curved' | 'wave' | 'curl'... */
  curve: {
    type: String,
    value: 'curved',
  },
  /** ArrowHead — 'v' | 'barb' | 'arrow' | 'none'... */
  head: {
    type: String,
    value: 'v',
  },
  /** MarkPen tone of the arrow. */
  tone: {
    type: String,
    value: 'blue',
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
  /** Draw the arrow at all. */
  arrow: {
    type: Boolean,
    value: true,
  },
  /** The note (written by Handwritten). */
  text: {
    type: String,
    value: '',
  },
  /** false hides the whole callout (upstream mark=off → display:none). */
  show: {
    type: Boolean,
    value: true,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};

export const validators = {
  direction: ['left', 'right', 'up', 'down', 'up-left', 'up-right', 'down-left', 'down-right'],
};
