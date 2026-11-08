/**
 * ll-corkboard-pin properties — upstream Pin (corkboard.tsx).
 */
export const props = {
  /** PaintKey — the pin's plastic color. */
  color: {
    type: String,
    value: 'tomato',
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
