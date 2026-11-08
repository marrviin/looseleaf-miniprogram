/**
 * ll-typewriter properties — upstream Typewriter (typewriter.tsx).
 * startOnView uses wx.createIntersectionObserver (upstream IntersectionObserver);
 * reduced-motion is desktop-only upstream — skipped. Upstream remounts with
 * a `key` to replay; here restart() does it.
 */
export const props = {
  /** One phrase or a list (lines mode joins them; cycle rotates them). */
  text: { type: null, optionalTypes: [Array, String], value: '' },
  /** 'lines' types down the page; 'cycle' backspaces between phrases. */
  mode: { type: String, value: 'lines' },
  /** Characters per second. */
  speed: { type: null, optionalTypes: [Number, String], value: 22 },
  /** ms before the first keystroke. */
  delay: { type: null, optionalTypes: [Number, String], value: 300 },
  /** ms a phrase holds (cycle) between wipes. */
  pause: { type: null, optionalTypes: [Number, String], value: 1400 },
  /** In cycle mode: backspace to empty and start over. */
  loop: { type: Boolean, value: false },
  /** Caret shape: 'block' | 'bar' | 'underscore' | '' (none). */
  cursor: { type: String, value: 'bar' },
  /** Wait until 40% visible before typing (default true). */
  startOnView: { type: Boolean, value: true },
  /** Hold the final height so the layout doesn't move while typing. */
  reserve: { type: Boolean, value: false },
  seed: { type: null, optionalTypes: [String, Number], value: '' },
  customStyle: String,
};
