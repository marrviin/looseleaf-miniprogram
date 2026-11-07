/**
 * ll-mascot properties — upstream Mascot (mascot.tsx), Stubby the pencil
 * stub, drawn as a die-cut sticker (no recipe pipeline).
 */
export const props = {
  /** MascotPose — idle, wave, think, write, sketch, celebrate, oops, shrug,
      sleep, peek, point, carry, halt, search, unplug. An unknown name draws
      nothing (upstream returns null). */
  pose: {
    type: String,
    value: 'idle',
  },
  /** Pixels tall, white die-cut border included (16 and up). Under 28 a face
      on a silhouette, under 56 the small redraw, up to 139 the master, from
      140 the hero (a shine and a ferrule line). */
  size: {
    type: null,
    optionalTypes: [Number, String],
    value: 96,
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
  /** One drawing of a flip-book pose: write 1-3, wave 1-3, celebrate 1-2.
      A pose or number without that frame draws the still pose. */
  frame: {
    type: null,
    optionalTypes: [Number, String],
    value: '',
  },
  /** Engine tier: 'lo' (default) or 'hi' (heavier, ~2x the weight). */
  tier: {
    type: String,
    value: 'lo',
  },
  /** The sticker's soft shadow (upstream .ll-drop-sticker). */
  shadow: {
    type: null,
    optionalTypes: [Boolean, String],
    value: true,
  },
  customStyle: String,
};
