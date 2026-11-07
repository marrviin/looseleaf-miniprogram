/**
 * ll-annotate properties — upstream Annotate: one component for every mark
 * (in the spirit of RoughNotation). It renders the matching mark component
 * (highlight/underline/circled/strike/scribble) for `type`, so every
 * behavior of those applies.
 */
export const props = {
  /** Which mark to put on the words: 'highlight' | 'underline' | 'circle'
      | 'box' | 'brackets' | 'strike-through' | 'crossed-off' | 'scribble'. */
  type: {
    type: String,
    value: 'highlight',
  },
  /** HighlightTone (yellow/pink/green/blue/orange/lilac/teal) for
      'highlight', MarkPen (ink/blue/red/green/pencil/marker/orange) for
      everything else. */
  color: {
    type: String,
    value: '',
  },
  /** 'fine' | 'regular' | 'brush' — a highlighter is held light/regular/heavy. */
  weight: {
    type: String,
    value: 'regular',
  },
  /** The line of an underline ('single' | 'double' | 'wavy' | 'scribble');
      ignored by the other types. */
  kind: {
    type: String,
    value: 'single',
  },
  /** The marked text. */
  text: {
    type: String,
    value: '',
  },
  show: {
    type: null,
    optionalTypes: [Boolean, String],
    value: true,
  },
  animate: {
    type: null,
    optionalTypes: [Boolean, String],
    value: false,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};

export const validators = {
  type: ['highlight', 'underline', 'circle', 'box', 'brackets', 'strike-through', 'crossed-off', 'scribble'],
  color: ['yellow', 'pink', 'green', 'blue', 'orange', 'lilac', 'teal', 'ink', 'red', 'pencil', 'marker', ''],
  weight: ['fine', 'regular', 'brush'],
  kind: ['single', 'double', 'wavy', 'scribble'],
};
