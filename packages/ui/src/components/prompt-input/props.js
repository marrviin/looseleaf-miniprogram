export const props = {
  /** The text (controlled when the page rebinds `value` from `valuechange`). */
  value: {
    type: String,
    value: '',
  },
  /** Starting text for the uncontrolled case (upstream defaultValue). */
  defaultValue: {
    type: String,
    value: '',
  },
  placeholder: {
    type: String,
    value: 'what are we making?',
  },
  /** 'ready' | 'submitted' | 'streaming' | 'error' — busy ones turn the
      send button into a stop button. */
  status: {
    type: String,
    value: 'ready',
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  /** Let an empty message go through (e.g. attachments only). */
  allowEmpty: {
    type: Boolean,
    value: false,
  },
  clearOnSubmit: {
    type: Boolean,
    value: true,
  },
  /** Makes the textarea read-only while submitted/streaming (upstream
      lockWhileStreaming; the system keyboard can't be dismissed from JS,
      so the field just stops accepting text). */
  lockWhileStreaming: {
    type: Boolean,
    value: false,
  },
  /** Footer note on the left (upstream PromptInputHint). */
  hint: {
    type: String,
    value: '',
  },
  /** Trigger chars that open the suggestion slip: 'a' or { char, atStart }
      (upstream triggers). Submit runs on the keyboard's send key; there is
      no mod-enter on a phone, so submitOn is folded into that. */
  triggers: {
    type: Array,
    value: [],
  },
  /** Suggestion rows for the slip: { char, text, hint?, icon?, insert? }.
      The component filters them by the word being typed (startsWith) and
      replaces the trigger word with `insert` (default char + text) on tap. */
  suggestions: {
    type: Array,
    value: [],
  },
  /** Upstream min/maxRows — the textarea grows to maxRows, then scrolls. */
  minRows: {
    type: null,
    optionalTypes: [Number, String],
    value: 1,
  },
  maxRows: {
    type: null,
    optionalTypes: [Number, String],
    value: 8,
  },
  stock: {
    type: String,
    value: 'napkin',
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};

export const validators = {
  status: ['ready', 'submitted', 'streaming', 'error'],
};
