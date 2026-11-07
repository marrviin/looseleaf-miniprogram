import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream NapkinTitle — the heading, bold script. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
