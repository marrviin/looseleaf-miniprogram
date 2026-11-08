import { createComponent } from '../../common/component';

/** ll-drawer-footer — buttons pushed to the bottom of the slip. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
