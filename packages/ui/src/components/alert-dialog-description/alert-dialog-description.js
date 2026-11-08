import { createComponent } from '../../common/component';

/** ll-alert-dialog-description — the consequence, in plain words. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
