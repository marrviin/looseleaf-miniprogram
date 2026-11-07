import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `ReceiptFooter` — the small muted sign-off. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
