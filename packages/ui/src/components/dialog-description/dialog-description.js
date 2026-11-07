import { createComponent } from '../../common/component';

/** ll-dialog-description — what the dialog is for. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
