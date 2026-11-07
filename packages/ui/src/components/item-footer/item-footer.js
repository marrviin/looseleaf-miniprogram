import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `ItemFooter` — a full-width row below the content (basis-full). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
