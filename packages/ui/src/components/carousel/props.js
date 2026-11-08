/**
 * ll-carousel properties — upstream Carousel (embla root).
 */
export const props = {
  /** 'horizontal' | 'vertical'. */
  orientation: {
    type: String,
    value: 'horizontal',
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
