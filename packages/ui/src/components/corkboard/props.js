/**
 * ll-corkboard properties — upstream Corkboard (corkboard.tsx).
 *
 * `value`/`defaultValue` are CorkboardValue: Record<noteId, { x?, y?, r?, z? }>.
 */
export const props = {
  /** Controlled positions. Leave unset for an uncontrolled board. */
  value: {
    type: null,
    optionalTypes: [Object],
    value: null,
  },
  defaultValue: {
    type: null,
    optionalTypes: [Object],
    value: null,
  },
  /** Accessible name of the group. */
  label: {
    type: String,
    value: 'Corkboard',
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  /** Pins the hand of the frame and the cork. */
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
