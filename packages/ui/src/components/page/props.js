/**
 * ll-page properties — upstream Page (page.tsx): the app's main paper
 * column with a header, content and footer. Punched holes, a torn edge
 * and a coffee stain are ink behind the content.
 *
 * `as` is not portable — set aria-role/aria-label on the component tag.
 */
export const props = {
  /** 'sm' | 'md' | 'lg' | 'xl' | 'full' — column width (32/42/56/72rem,
      unbounded). Always centered. */
  width: {
    type: String,
    value: 'md',
  },
  /** 'none' | 'start' | 'top' | boolean — punched holes; true = 'start'.
      The start/top padding grows to clear them. */
  holes: {
    type: null,
    optionalTypes: [String, Boolean],
    value: false,
  },
  /** Gummed reinforcement rings round the holes. */
  reinforce: {
    type: Boolean,
    value: false,
  },
  /** A coffee ring in the lower corner. */
  stain: {
    type: Boolean,
    value: false,
  },
  /** Shorthand torn edge: true | 'top' | 'bottom' | 'both'. */
  torn: {
    type: null,
    optionalTypes: [Boolean, String],
    value: '',
  },
  stock: {
    type: String,
    value: 'paper',
  },
  rules: {
    type: String,
    value: 'none',
  },
  /** Paper passthrough — see ll-paper. */
  tilt: {
    type: null,
    optionalTypes: [Boolean, Number, String],
    value: true,
  },
  tape: {
    type: null,
    optionalTypes: [String, Boolean],
    value: false,
  },
  tapeKind: {
    type: String,
    value: 'masking',
  },
  fastener: {
    type: null,
    optionalTypes: [String, Boolean],
    value: false,
  },
  fastenerTone: {
    type: String,
    value: '',
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  ariaLabel: String,
  customStyle: String,
};
