import { createComponent } from '../../common/component';

/** Upstream IndexCardContent — the body; text sits on the printed 30px
   lines (17px on a 30px line-height comes from the card). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
