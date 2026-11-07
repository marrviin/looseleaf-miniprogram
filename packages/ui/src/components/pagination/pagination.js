import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Pagination` — a centered `nav` landmark around the page list.
    Pure layout; the links are ll-button-based family members in the slot. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
