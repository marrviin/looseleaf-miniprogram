import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `EnvelopeSender` — the small return address in the top-left
    corner of the envelope's face. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
