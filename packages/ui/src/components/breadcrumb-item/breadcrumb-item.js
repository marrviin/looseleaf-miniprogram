import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `BreadcrumbItem` — a plain `li`. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
