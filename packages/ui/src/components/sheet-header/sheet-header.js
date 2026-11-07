import { createComponent } from '../../common/component';

/** ll-sheet-header — title + description column, padded 16px; padded at the
    end when the corner x is shown (pass `close`). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    close: {
      type: Boolean,
      value: false,
    },
    customStyle: String,
  },
});
