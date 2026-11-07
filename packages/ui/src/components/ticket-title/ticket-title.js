import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream TicketTitle — the heading. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
