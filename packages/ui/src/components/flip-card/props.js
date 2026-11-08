/**
 * ll-flip-card properties — upstream FlipCard (flip-card.tsx).
 *
 * The upstream compound (FlipCard / FlipCardFront / FlipCardBack /
 * FlipCardTrigger) folds into one component here: the faces are the named
 * slots `front` and `back` (each wrapped in its own paper), and the
 * invisible trigger overlay is the `trigger` prop — with trigger=false the
 * page drives flipping through toggle(). The pencil-corner arrow hint is
 * drawn by the flip-card-trigger recipe over the whole card.
 */
export const props = {
  /** Controlled state; null = uncontrolled (defaultFlipped + taps). */
  flipped: {
    type: null,
    optionalTypes: [Boolean],
    value: null,
  },
  defaultFlipped: {
    type: Boolean,
    value: false,
  },
  /** 'y' turns it like a page left-to-right, 'x' like a top-bound pad. */
  axis: {
    type: String,
    value: 'y',
  },
  /** The invisible full-card tap overlay (with the corner arrow hint). */
  trigger: {
    type: Boolean,
    value: true,
  },
  /** Draw the corner arrow hint on the overlay. */
  hint: {
    type: Boolean,
    value: true,
  },
  /** Accessible name for the trigger. */
  label: {
    type: String,
    value: 'Flip card',
  },
  /** StockName for the front / back sheets (upstream Face stock). */
  frontStock: {
    type: String,
    value: 'index-card',
  },
  backStock: {
    type: String,
    value: 'slip',
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
