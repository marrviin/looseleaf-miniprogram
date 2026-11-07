import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `EmptyHeader` — the column of media, title and description. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
