import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream typography typography-lead. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
