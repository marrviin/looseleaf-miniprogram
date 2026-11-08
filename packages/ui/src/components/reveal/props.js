/**
 * ll-reveal properties — upstream Reveal (reveal.tsx).
 *
 * Slotted children live in the page's style scope, so the upstream
 * `stagger` (animating arbitrary direct children) can't port — give each
 * child its own ll-reveal with an incremental `delay` instead. `as` also
 * doesn't port (the root is a view). Upstream replays by remounting with a
 * new key; here restart() re-arms.
 */
export const props = {
  /** 'wipe' | 'soak' | 'drop' | 'pop' | 'toss'. */
  effect: { type: String, value: 'wipe' },
  /** Wipe direction: 'start' (left→right) or 'end' (right→left). */
  from: { type: String, value: 'start' },
  /** Seconds before the arrival (after it is on screen). */
  delay: { type: null, optionalTypes: [Number, String], value: 0 },
  /** Intersection ratio that counts as "on screen". */
  threshold: { type: null, optionalTypes: [Number, String], value: 0.25 },
  /** Play once, or again on every re-entry (once=false). */
  once: { type: Boolean, value: true },
  /** A marker tip writes the content in (wipe only). */
  nib: { type: Boolean, value: false },
  /** Nib color (a --ll-* stationery name). */
  nibColor: { type: String, value: 'tomato' },
  customStyle: String,
};
