import { createComponent } from '../../common/component';

/** ll-drawer-description — what the slip is for. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
