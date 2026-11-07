/**
 * ll-card properties — upstream Card/Paper (stock subset, see README).
 */
export const props = {
  /** Paper stock. Upstream also has graph/check/kraft/… — P3 (sheet machinery). */
  stock: {
    type: String,
    value: 'card',
  },
  /** Pin the hand: same seed = same texture offset + tilt. */
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  /** The stock's small random rotation (upstream tilt). */
  tilt: {
    type: Boolean,
    value: true,
  },
  customStyle: String,
};

export const validators = {
  stock: ['card', 'paper', 'slip', 'index-card', 'kraft'],
};
