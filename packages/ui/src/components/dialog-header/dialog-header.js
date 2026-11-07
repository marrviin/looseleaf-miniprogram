import { createComponent } from '../../common/component';

/** ll-dialog-header — title + description column. Centered on phones, and
    (when the corner x is shown, pass `close`) padded at the end on larger
    screens so the title clears the mark. */
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
