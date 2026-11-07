/**
 * ll-paper properties — upstream Paper (paper.tsx), the sheet every overlay
 * (dialog, sheet, popover...) is drawn on.
 *
 * `curl` (napkin chamfer) is deferred to P3; 'ruled-hand' renders as plain
 * 'ruled' (the hand-drawn rules recipe is deferred).
 */
export const props = {
  /** StockName — what the sheet is made of. */
  stock: {
    type: String,
    value: 'paper',
  },
  /** EdgeSpec — 'torn' | 'deckle' | 'crimp' | 'zig' | 'perf' | 'scallop' | 'cut',
      or an object of per-side kinds ({ top: 'torn' }). Cut edges draw no ink
      upstream: the face is pure CSS (color + tooth tiles + paper-light). */
  edge: {
    type: null,
    optionalTypes: [String, Object],
    value: '',
  },
  /** true = seeded tilt from the stock (max ~1.6deg); number = degrees; false = flat. */
  tilt: {
    type: null,
    optionalTypes: [Boolean, Number, String],
    value: true,
  },
  /** Tape strips: 'corner' | 'top' | 'both' | false. */
  tape: {
    type: null,
    optionalTypes: [String, Boolean],
    value: false,
  },
  /** TapeKind — masking | washi-dots | washi-stripes | washi-zigzag | washi-gingham | kraft | clear. */
  tapeKind: {
    type: String,
    value: 'masking',
  },
  /** Fastener: 'clip' | 'pin' | 'staple' | 'binder-clip' | false. */
  fastener: {
    type: null,
    optionalTypes: [String, Boolean],
    value: false,
  },
  /** 'steel' or an accent (tomato…bubblegum). */
  fastenerTone: {
    type: String,
    value: '',
  },
  /** 'stock' (the stock's shadow kind), 'none', or a SheetShadowKind. */
  shadow: {
    type: String,
    value: 'stock',
  },
  /** Raw box-shadow overriding the stock's (upstream Sheet's per-side
      --ll-sheet-shadow overrides) — applied on the sheet visual. */
  shadowCss: {
    type: String,
    value: '',
  },
  /** RuleName printed rules ('ruled' | 'pad' | 'index' | 'graph' | 'dots' |
      'ledger' | 'window' | 'ruled-hand'); '' = the stock's default. */
  rules: {
    type: String,
    value: '',
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
