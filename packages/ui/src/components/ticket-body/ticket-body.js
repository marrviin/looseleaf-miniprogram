import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream TicketBody — the main panel. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
