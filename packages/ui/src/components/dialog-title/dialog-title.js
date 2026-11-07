import { createComponent } from '../../common/component';

/** ll-dialog-title — the sheet's name, in the script face. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
