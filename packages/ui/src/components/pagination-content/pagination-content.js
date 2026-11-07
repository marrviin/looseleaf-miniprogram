import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `PaginationContent` — the `ul` of page entries. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
