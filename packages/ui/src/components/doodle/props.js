/**
 * ll-doodle properties — upstream Doodle (doodle.tsx), a margin doodle drawn
 * from the doodles ArtDef map (no recipe pipeline).
 */
export const props = {
  /** DoodleName — a doodle id (`star`, `sun`, `flower`, `mushroom`...). An
      unknown name draws nothing (upstream returns null). */
  name: {
    type: String,
    value: '',
  },
  /** Pixels. Below 72 the 48px redraw (silhouette + one detail, heavier line),
      from 72 the 96px master, from 128 the hero tier. */
  size: {
    type: null,
    optionalTypes: [Number, String],
    value: 96,
  },
  /** Color of the accent washes: tomato…bubblegum, 'hi' or 'kraft'. */
  accent: {
    type: String,
    value: '',
  },
  /** Another seed, another hand. */
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  /** Accessible name; decorative (aria-hidden) without it. */
  label: {
    type: String,
    value: '',
  },
  /** Degrees to turn it (corner flourishes are drawn for the top-left). */
  rotate: {
    type: null,
    optionalTypes: [Number, String],
    value: 0,
  },
  /** Mirror horizontally (CSS). */
  flip: {
    type: null,
    optionalTypes: [Boolean, String],
    value: false,
  },
  customStyle: String,
};
