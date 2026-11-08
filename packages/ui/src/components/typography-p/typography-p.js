import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream typography typography-p. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
