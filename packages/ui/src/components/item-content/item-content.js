import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `ItemContent` — flex min-w-0 flex-1 flex-col gap-1. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
