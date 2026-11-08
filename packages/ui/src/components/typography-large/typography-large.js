import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream typography typography-large. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
