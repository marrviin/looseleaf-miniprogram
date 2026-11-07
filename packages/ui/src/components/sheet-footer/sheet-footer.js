import { createComponent } from '../../common/component';

/** ll-sheet-footer — buttons pushed to the bottom (mt-auto). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
