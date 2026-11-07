import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `ReceiptDivider` — a dashed rule. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
