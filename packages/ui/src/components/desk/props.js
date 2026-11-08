/**
 * ll-desk properties — upstream Desk (desk.tsx): the sage bookcloth surface
 * everything else lies on, with an optional layer of objects behind the
 * content.
 *
 * `as` ('div' | 'main' | 'section' | 'article') is not portable — the root
 * is a view; set aria-role on it via the demo/page instead.
 */
export const props = {
  /** DeskObject[] | boolean — things lying on the blotter behind the
      content: 'coffee', 'pencil', 'clips', 'ruler', 'pins'. true = all
      five. (Upstream hides them below sm / in calm density; mini-program
      pages are small, so they are always drawn here — pass objects only
      where there is room.) */
  objects: {
    type: null,
    optionalTypes: [Array, Boolean],
    value: false,
  },
  /** Vignette strength: 0 (or false) removes it, 1 is the theme's own (a
      whisper of shade), above 1 darkens the corners quickly (2.5 is a dim
      room). */
  lamp: {
    type: null,
    optionalTypes: [Number, Boolean],
    value: 1,
  },
  /** Pins the hand of the objects. */
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  ariaLabel: String,
  customStyle: String,
};
