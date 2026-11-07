import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `EmptyDescription` — the muted explanation. (Upstream styles a
    link inside it blue and underlined; WeChat rich text has no `a`, so a
    link-colored text node can be slotted in styled by the page.) */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
