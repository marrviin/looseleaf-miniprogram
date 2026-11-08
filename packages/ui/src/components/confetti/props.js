/**
 * ll-confetti properties — upstream Confetti / ConfettiTrigger (confetti.tsx).
 *
 * The overlay folds into one component: an absolutely-positioned layer the
 * page places inside a relative container; burst() throws from it. The
 * trigger button and useConfetti hook don't survive as separate tags — the
 * demo calls the component's burst() (with the same option keys).
 */
export const props = {
  /** Pieces per burst (clamped to 0..400). */
  count: { type: null, optionalTypes: [Number, String], value: 70 },
  /** Cone half-width in degrees; 360 = a ring. */
  spread: { type: null, optionalTypes: [Number, String], value: 70 },
  /** Launch direction in degrees (90 = straight up). */
  angle: { type: null, optionalTypes: [Number, String], value: 90 },
  velocity: { type: null, optionalTypes: [Number, String], value: 1100 },
  gravity: { type: null, optionalTypes: [Number, String], value: 520 },
  /** Constant sideways push (streamers). */
  drift: { type: null, optionalTypes: [Number, String], value: 0 },
  /** Flight length in ms (upstream duration). */
  duration: { type: null, optionalTypes: [Number, String], value: 2600 },
  /** Subset of the eight stationery colors. null = all. */
  colors: { type: null, optionalTypes: [Array], value: null },
  /** Subset of strip/dot/star/triangle/curl/scrap. null = all. */
  shapes: { type: null, optionalTypes: [Array], value: null },
  /** Piece size multiplier. */
  scalar: { type: null, optionalTypes: [Number, String], value: 1 },
  seed: { type: null, optionalTypes: [Number, String], value: null },
  /** Container-relative launch point {x, y} px; null = the center. */
  origin: { type: null, optionalTypes: [Object], value: null },
  /** Burst when it turns true (and again on each false→true flip). */
  active: { type: Boolean, value: false },
  /** Bump to burst from the template without calling burst(). */
  burstKey: { type: null, optionalTypes: [Number, String], value: null },
  customStyle: String,
};
