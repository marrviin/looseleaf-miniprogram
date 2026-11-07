import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `EmptyContent` — actions and anything else below the header. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
