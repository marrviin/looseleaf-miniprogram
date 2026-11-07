import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `BreadcrumbSeparator` — an `li` hidden from assistive tech. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
