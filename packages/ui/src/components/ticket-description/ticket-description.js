import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream TicketDescription — the line under the title. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
