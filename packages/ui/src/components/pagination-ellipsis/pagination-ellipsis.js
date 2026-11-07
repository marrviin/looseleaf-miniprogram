import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `PaginationEllipsis` — a square slot with the ellipsis icon. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
