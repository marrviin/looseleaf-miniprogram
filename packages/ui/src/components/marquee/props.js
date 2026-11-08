/**
 * ll-marquee properties — upstream Marquee (marquee.tsx).
 *
 * Upstream loops arbitrary slotted children (MarqueeItem spans) by
 * rendering `copies` groups of the same slot; a mini-program slot can't be
 * stamped N times, so this port takes the ticker lines as an `items` array
 * and draws the star separator itself (the upstream MarqueeItem default).
 * Rich slotted content (links) can't loop — pass plain strings.
 */
export const props = {
  /** The ticker lines; each becomes one MarqueeItem (text + star). */
  items: {
    type: Array,
    value: [],
  },
  /** Accessible name for the ticker region. */
  label: {
    type: String,
    value: 'Ticker',
  },
  /** px per second; the loop duration is one group width / speed. */
  speed: {
    type: null,
    optionalTypes: [Number, String],
    value: 60,
  },
  /** 'start' (left→right content flow) or 'end' (reverse). */
  direction: {
    type: String,
    value: 'start',
  },
  /** TapeKind of the band behind the text. */
  tape: {
    type: String,
    value: 'washi-stripes',
  },
  /** Accent for the tape: tomato…bubblegum; '' = the tape's default. */
  color: {
    type: String,
    value: '',
  },
  /** Controlled pause; '' = uncontrolled (defaultPaused / the button). */
  paused: {
    type: null,
    optionalTypes: [Boolean],
    value: null,
  },
  defaultPaused: {
    type: Boolean,
    value: false,
  },
  /** The round pause/play button at the end of the strip. */
  controls: {
    type: Boolean,
    value: true,
  },
  /** Another seed, another hand. */
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
