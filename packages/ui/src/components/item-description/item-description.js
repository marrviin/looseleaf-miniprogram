import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `ItemDescription` — a muted line clamped to two lines. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
