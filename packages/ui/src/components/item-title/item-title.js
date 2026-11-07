import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `ItemTitle` — hand font, 16px, bold. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
