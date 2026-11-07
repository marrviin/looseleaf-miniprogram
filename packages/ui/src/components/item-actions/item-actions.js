import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `ItemActions` — the trailing controls. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
