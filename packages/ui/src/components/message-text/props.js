/**
 * ll-message-text properties — upstream MessageText (message.tsx): the words
 * of a message, set like a person wrote them (per-word baseline jitter), so
 * streaming text soaks in like wet ink.
 */
export const props = {
  /** The text so far. Newlines are kept. */
  text: {
    type: String,
    value: '',
  },
  /** Soak new words in and show the caret. */
  streaming: {
    type: Boolean,
    value: false,
  },
  /** The per-word wobble. */
  jitter: {
    type: Boolean,
    value: true,
  },
  /** Pins the wobble. */
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
