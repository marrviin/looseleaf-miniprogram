export const props = {
  name: {
    type: String,
    value: '',
  },
  /** Icon size in px. Upstream also reads size-N classes / CSS context; a
      WeChat class can't carry px, so `size` is the only channel here. */
  size: {
    type: null,
    optionalTypes: [Number, String],
    value: null,
  },
  tone: {
    type: String,
    value: 'ui',
  },
  accent: {
    type: String,
    value: '',
  },
  seed: {
    type: null,
    optionalTypes: [Number, String],
    value: null,
  },
  label: {
    type: String,
    value: '',
  },
  /** true / 'x' / 'y' — mirrored only for icons whose ArtDef says mirror. */
  flip: {
    type: null,
    optionalTypes: [String, Boolean],
    value: null,
  },
  weight: {
    type: null,
    optionalTypes: [Number, String],
    value: null,
  },
  /** Platform extension: upstream icons paint in currentColor (the parent's
      text color), but a background-image data URI can't inherit color. Pass
      a CSS color to bake it into the drawing; default is the --ll-ink token. */
  ink: {
    type: String,
    value: '',
  },
  customStyle: String,
};
