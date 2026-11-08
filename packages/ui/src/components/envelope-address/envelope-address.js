import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `EnvelopeAddress` — the hand-script address block, underlined
    like ruled paper every 28px. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
