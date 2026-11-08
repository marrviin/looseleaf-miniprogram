import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `QuoteAttribution` — an em-dash before the muted hand note. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
