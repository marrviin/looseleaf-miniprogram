import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Breadcrumb` — the nav landmark around the crumb list. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
