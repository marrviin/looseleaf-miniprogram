import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `ReceiptLines` — the dashed-bordered description list. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
