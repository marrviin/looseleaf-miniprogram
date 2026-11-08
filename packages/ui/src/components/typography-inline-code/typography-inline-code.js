import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream typography InlineCode — mono chip with the wobbly radius. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
