/**
 * ll-tear-off properties — upstream TearOff + TearOffBody + TearOffStub
 * (tear-off.tsx) folded into one component: React context cannot cross a
 * component boundary here, and the three parts only share the torn state.
 * The body and the stub take the document's content through named slots.
 */
export const props = {
  /** Controlled: torn state. When set, the component only reports
      (tornchange) and the page owns the flag — set it back to false to put
      a fresh stub on, dropping onto the ticket. */
  torn: {
    type: null,
    optionalTypes: [Boolean],
    value: null,
  },
  defaultTorn: {
    type: Boolean,
    value: false,
  },
  /** "horizontal" (the stub sits after the ticket) or "vertical" (below). */
  orientation: {
    type: String,
    value: 'horizontal',
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  /** What the status line says when the stub comes off. */
  tornMessage: {
    type: String,
    value: 'Torn off.',
  },
  /** Accessible name of the stub button; default the stub's own text. */
  stubLabel: {
    type: String,
    value: '',
  },
  /** What each half is made of (Paper stocks). */
  bodyStock: {
    type: String,
    value: 'paper',
  },
  stubStock: {
    type: String,
    value: 'index-card',
  },
  customStyle: {
    type: String,
    value: '',
  },
  bodyCustomStyle: {
    type: String,
    value: '',
  },
  stubCustomStyle: {
    type: String,
    value: '',
  },
};

export const validators = {
  orientation: ['horizontal', 'vertical'],
};
