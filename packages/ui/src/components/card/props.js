/**
 * ll-card properties — upstream Card = Paper with stock="card", rules="none"
 * (card.tsx: `type CardProps = PaperProps`), so the port carries the full
 * Paper prop set; the sheet itself is drawn by ll-paper.
 */
export const props = {
  /** StockName — paper, card, slip, index-card, graph, dot-grid, check, kraft, … */
  stock: {
    type: String,
    value: 'card',
  },
  /** RuleName printed rules; 'none' = upstream Card's default (no rules). */
  rules: {
    type: String,
    value: 'none',
  },
  /** EdgeSpec — 'torn' | 'deckle' | 'crimp' | 'zig' | 'perf' | 'scallop' | 'cut',
      or per-side ({ top: 'torn' }); '' = the stock's default. */
  edge: {
    type: null,
    optionalTypes: [String, Object],
    value: '',
  },
  /** true = seeded tilt from the stock; number = degrees; false = flat. */
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
  /** Raw box-shadow overriding the stock's — applied on the sheet visual. */
  shadowCss: {
    type: String,
    value: '',
  },
  /** Pin the hand: same seed = same texture offset + tilt. */
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
