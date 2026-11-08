/**
 * ll-lettering properties — upstream Lettering (lettering.tsx). `as` has
 * no miniprogram counterpart (no element semantics); the view carries
 * aria-role="heading" and one Lettering per page as the h1 is the
 * page's business.
 */
export const props = {
  /** The line to set. Whitespace is kept between words. */
  text: {
    type: String,
    value: '',
  },
  /** 'sm' | 'md' | 'lg' | 'xl' | 'hero' — 30, 48, 60, 96 and 128 px
      (upstream pairs xl/hero with smaller mobile values; the docs-site
      sizes are the ones a display title is for). */
  size: {
    type: String,
    value: 'lg',
  },
  /** ToneName — the second color of the print (the riso pass). */
  tone: {
    type: String,
    value: 'marker',
  },
  /** ToneName — a third pass in another accent, printed to the other
      side (upstream duotone). */
  duotone: {
    type: String,
    value: '',
  },
  /** Per-word baseline jitter, 0 (typeset) to 2 (hurried). */
  wobble: {
    type: null,
    optionalTypes: [Number, String],
    value: 0,
  },
  /** Pins the hand of the wobble — same seed, same line. */
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
