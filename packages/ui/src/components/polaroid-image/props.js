/**
 * ll-polaroid-image properties — upstream PolaroidImage: the square,
 * recessed photo window. A `scene` draws a little picture in marker and
 * felt tip; otherwise put an <image> in the slot.
 */
export const props = {
  /** 'hills' | 'sea' | 'house' | 'night' — draw a scene in the window. */
  scene: {
    type: String,
    value: '',
  },
  /** Orange date stamp in the window's foot (font-mono, glowing). */
  date: {
    type: String,
    value: '',
  },
  /** True for a beat: the print starts covered in photo white and soaks
      away (0.5s delay, 0.52s fade). */
  develop: {
    type: null,
    optionalTypes: [Boolean, String],
    value: false,
  },
  /** Accessible name when a scene is drawn (role img). */
  label: {
    type: String,
    value: '',
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};
