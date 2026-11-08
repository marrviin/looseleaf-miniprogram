/**
 * ll-carousel-dot properties — one carousel tick (upstream inline `Tick`).
 */
export const props = {
  index: {
    type: Number,
    value: 0,
  },
  selected: {
    type: Boolean,
    value: false,
  },
  /** Every fifth tick is the long slash finishing the group. */
  slash: {
    type: Boolean,
    value: false,
  },
  seed: {
    type: String,
    value: '',
  },
  customStyle: String,
};
