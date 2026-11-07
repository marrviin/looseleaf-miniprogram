/**
 * ll-sticky-note properties — upstream StickyNote (sticky-note.tsx): a
 * square of colored paper with a gum band, written in marker. It can hang
 * from a pin or a strip of tape and grow a tick box ticked with a felt pen.
 * (Paper's `curl` is not ported yet — that example renders flat.)
 */
export const props = {
  /** yellow | green | orange | pink | blue — the pad (stock sticky-<color>). */
  color: {
    type: String,
    value: 'yellow',
  },
  /** true/false = the note grows a tick box, shown in this state. Omit
      (empty) for a plain note. Fires `donchange` when the box is pressed. */
  done: {
    type: null,
    optionalTypes: [Boolean],
    value: '',
  },
  /** Accessible name of the tick box. */
  doneLabel: {
    type: String,
    value: 'Done',
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

export const validators = {
  color: ['yellow', 'green', 'orange', 'pink', 'blue'],
};
