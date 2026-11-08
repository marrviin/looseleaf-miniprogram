/**
 * ll-code-block properties — upstream CodeBlock (single folded component;
 * the upstream header/stats/copy parts are built in).
 */
export const props = {
  /** The code text; a trailing newline is ignored. */
  code: {
    type: String,
    value: '',
  },
  /** Language hint; inferred from `filename` when omitted. */
  language: {
    type: String,
    value: '',
  },
  /** Shown as the title (and drives the language guess). */
  filename: {
    type: String,
    value: '',
  },
  lineNumbers: {
    type: Boolean,
    value: false,
  },
  /** Force diff mode; also on automatically for language 'diff'. */
  diff: {
    type: null,
    optionalTypes: [Boolean, null],
    value: null,
  },
  /** Soft-wrap long lines instead of scrolling sideways. */
  wrap: {
    type: Boolean,
    value: false,
  },
  startLine: {
    type: null,
    optionalTypes: [Number, String],
    value: 1,
  },
  copyable: {
    type: Boolean,
    value: true,
  },
  /** 'dark' | 'paper'. */
  tone: {
    type: String,
    value: 'dark',
  },
  /** Paper container stock (paper tone only). */
  stock: {
    type: String,
    value: 'slip',
  },
  /** Paper tape (paper tone only). */
  tape: {
    type: null,
    optionalTypes: [String, Boolean, null],
    value: 'top',
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
