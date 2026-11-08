/**
 * ll-stamp-surface properties — upstream StampSurface (stamp-button.tsx):
 * the page that takes stamps — a positioned box holding the document and
 * any number of ll-stamp-buttons. Impressions are plain JSON
 * { id, press, x, y (fractions of the surface), name or text, shape, ink,
 * turn, seed, … }; clear it with [] or restore a saved one.
 */
export const props = {
  /** Controlled: the impressions on the page. When set, the surface only
      reports (valuechange) and the page owns the array. */
  value: {
    type: null,
    optionalTypes: [Array],
    value: null,
  },
  defaultValue: {
    type: null,
    optionalTypes: [Array],
    value: null,
  },
  /** Keep only the most recent N impressions. */
  max: {
    type: null,
    optionalTypes: [Number, String],
    value: 0,
  },
  customStyle: {
    type: String,
    value: '',
  },
};
