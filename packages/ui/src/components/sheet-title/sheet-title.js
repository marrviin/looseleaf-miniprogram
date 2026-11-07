import { createComponent } from '../../common/component';

/** ll-sheet-title — the page's name, in the script face. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
