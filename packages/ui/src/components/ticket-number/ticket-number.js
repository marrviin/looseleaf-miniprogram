import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream TicketNumber — the serial in red-ink mix, widest tracking. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
