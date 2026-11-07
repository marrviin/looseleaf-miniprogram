import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `ReceiptHeader` — the centered shop name / date stack; the first
    child is the headline. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
