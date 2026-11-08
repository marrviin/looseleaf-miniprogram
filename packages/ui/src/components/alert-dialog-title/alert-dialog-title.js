import { createComponent } from '../../common/component';

/** ll-alert-dialog-title — the question, in the script face. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
