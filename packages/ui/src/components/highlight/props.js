/**
 * ll-highlight properties — upstream Highlight (mark element): a highlighter
 * swipe behind the text, drawn once per measured line. text/show/seed live in
 * the shared mark behavior (common/mark.js).
 */
export const props = {
  /** HighlightTone — yellow | pink | green | blue | orange | lilac | teal. */
  tone: {
    type: String,
    value: 'yellow',
  },
  /** light | regular | heavy — the marker's chisel width. */
  weight: {
    type: String,
    value: 'regular',
  },
  /** 'full' covers the lines; 'under' tucks the swipe under the baseline. */
  cover: {
    type: String,
    value: 'full',
  },
  customStyle: String,
};

export const validators = {
  tone: ['yellow', 'pink', 'green', 'blue', 'orange', 'lilac', 'teal'],
  weight: ['light', 'regular', 'heavy'],
  cover: ['full', 'under'],
};
