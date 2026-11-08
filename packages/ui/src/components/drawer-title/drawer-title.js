import { createComponent } from '../../common/component';

/** ll-drawer-title — the slip's name, in the script face. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
