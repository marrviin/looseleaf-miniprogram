import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `ItemHeader` — a full-width row above the content (basis-full). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
