import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `BreadcrumbEllipsis` — decoration on its own. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
