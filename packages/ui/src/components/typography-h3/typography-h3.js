import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream typography typography-h3 — script face, no rule. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
