import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream TicketStub — the tear-off panel, sized by the ticket's
    stubWidth (upstream TicketContext; WeChat slot content is page-owned,
    so the width rides a plain property here — keep it in sync with the
    parent ll-ticket's stub-width). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
