/**
 * ll-signature-pad properties — upstream SignaturePad (signature-pad.tsx).
 *
 * The composition parts (Canvas / Typed / Clear / ModeToggle / Guides) fold
 * into one component; the hidden form input doesn't port (no native form
 * validity in WeChat — the page owns validation and passes `invalid`).
 */
export const props = {
  /** Controlled signature image (an SVG data URL). null = uncontrolled. */
  value: { type: null, optionalTypes: [String], value: null },
  /** Initial signature image for the uncontrolled pad. */
  defaultValue: { type: String, value: '' },
  required: { type: Boolean, value: false },
  disabled: { type: Boolean, value: false },
  readOnly: { type: Boolean, value: false },
  /** Draw the baseline red and show the message (page-owned validation). */
  invalid: { type: Boolean, value: false },
  message: { type: String, value: 'Please sign in the box.' },
  /** 'draw' | 'type'. */
  mode: { type: null, optionalTypes: [String], value: null },
  defaultMode: { type: String, value: 'draw' },
  /** Offer the "Type instead" link (upstream typedFallback). */
  typedFallback: { type: Boolean, value: true },
  /** Signature pen color (a --ll-* stationery name). */
  penColor: { type: String, value: 'ink-you' },
  /** 'brush' (swells where you lean) or 'felt'. */
  pen: { type: String, value: 'brush' },
  /** Upstream also takes 'png' (canvas rasterization) — svg only here. */
  format: { type: String, value: 'svg' },
  /** Canvas coordinate space. */
  width: { type: null, optionalTypes: [Number, String], value: 480 },
  height: { type: null, optionalTypes: [Number, String], value: 180 },
  seed: { type: null, optionalTypes: [String, Number], value: '' },
  /** Accessible name of the canvas. */
  label: { type: String, value: 'Signature' },
  customStyle: String,
};
