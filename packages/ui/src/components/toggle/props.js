/**
 * ll-toggle properties.
 * API aligned with upstream looseleaf Toggle (variant × size × tone × pressed).
 */
export const props = {
  /** default = whisper pencil box at rest; outline = inked box always. */
  variant: {
    type: String,
    value: 'default',
  },
  size: {
    type: String,
    value: 'default',
  },
  /** Body color when on: 'hi' (yellow highlighter) or 'marker' (terracotta). */
  tone: {
    type: String,
    value: 'hi',
  },
  /** The toggle state (upstream Radix `pressed`): on = highlighter body. */
  pressed: {
    type: Boolean,
    value: false,
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  /** Draws the box in red pencil (upstream aria-invalid). */
  invalid: {
    type: Boolean,
    value: false,
  },
  /** Item value inside an ll-toggle-group (ignored standalone). */
  value: {
    type: String,
    value: '',
  },
  /** Accessibility label (icon-only toggles need one). */
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};

/** Validation lists, consumed by docs generation and unit tests. */
export const validators = {
  variant: ['default', 'outline'],
  size: ['default', 'sm', 'lg'],
  tone: ['hi', 'marker'],
};
