import { createComponent } from '../../common/component';

/** ll-sheet-description — what the sheet is for. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
