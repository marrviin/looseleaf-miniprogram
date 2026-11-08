import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Quote` — the figure wrapper; content flows top-down with a
    gap (quote-text then quote-attribution). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
