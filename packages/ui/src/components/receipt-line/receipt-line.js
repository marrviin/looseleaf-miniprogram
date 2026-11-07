import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `ReceiptLine` — one dt/dd row: name (with optional qty) left,
    tabular price right. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
