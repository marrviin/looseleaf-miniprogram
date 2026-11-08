import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream typography typography-h2 — script face, pencil rule underneath. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
