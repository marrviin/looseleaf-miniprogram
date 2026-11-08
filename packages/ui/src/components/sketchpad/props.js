/**
 * ll-sketchpad properties — upstream Sketchpad (sketchpad.tsx).
 *
 * The toolbar/canvas parts fold into one component; the composition slots
 * (SketchpadTools/Colors/Sizes/Undo/…) don't survive as separate tags —
 * tools/colors/clearLabel props cover the demo arrangements (the custom
 * toolbar flex layouts don't; see the demo header note).
 */
export const props = {
  /** Controlled strokes (SketchStroke[]). null = uncontrolled. */
  value: { type: null, optionalTypes: [Array], value: null },
  /** Initial strokes for the uncontrolled pad. */
  defaultValue: { type: null, optionalTypes: [Array], value: null },
  /** Controlled tool ('felt'|'brush'|'pencil'|'marker'|'highlighter'|'eraser'). */
  tool: { type: null, optionalTypes: [String], value: null },
  defaultTool: { type: String, value: 'felt' },
  /** Which tool buttons show (default felt/pencil/marker/highlighter/eraser). */
  tools: { type: null, optionalTypes: [Array], value: null },
  /** Which color swatches show (default: the ten SKETCH_COLORS). */
  colors: { type: null, optionalTypes: [Array], value: null },
  /** Controlled color (a --ll-* stationery name). */
  color: { type: null, optionalTypes: [String], value: null },
  defaultColor: { type: String, value: 'ink' },
  /** Controlled pen width (0.6 fine / 1 medium / 1.9 bold). */
  size: { type: null, optionalTypes: [Number, String], value: null },
  defaultSize: { type: null, optionalTypes: [Number, String], value: 1 },
  /** Canvas coordinate space (points are stored in this space). */
  width: { type: null, optionalTypes: [Number, String], value: 640 },
  height: { type: null, optionalTypes: [Number, String], value: 400 },
  readOnly: { type: Boolean, value: false },
  disabled: { type: Boolean, value: false },
  /** Draw itself on again once mounted (demo 03 pairs it with readOnly). */
  replay: { type: Boolean, value: false },
  replaySpeed: { type: null, optionalTypes: [Number, String], value: 1 },
  /** Canvas sheet: 'plain' | 'ruled' | 'graph' | 'dots' | 'kraft'. */
  paper: { type: String, value: 'plain' },
  /** Overrides the paper's stock on the canvas sheet (upstream paperProps).
      Empty = the paper's own stock. */
  stock: { type: String, value: '' },
  /** Canvas sheet shadow ('stock' | 'none' | a SheetShadowKind) — upstream
      paperProps.shadow. Empty = 'stock'. */
  shadow: { type: String, value: '' },
  /** Canvas paper tape: 'corner' | 'top' | 'both' | 'none'. */
  paperTape: { type: String, value: 'none' },
  paperTapeKind: { type: String, value: 'masking' },
  /** Accessible name of the canvas. */
  label: { type: String, value: 'Drawing' },
  /** The clear button's text (upstream accepts children; here a label). */
  clearLabel: { type: String, value: 'Clear' },
  /** Hide the whole toolbar (a readOnly pad hides it anyway). */
  showToolbar: { type: Boolean, value: true },
  customStyle: String,
};
