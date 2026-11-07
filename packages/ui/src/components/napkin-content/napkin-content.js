import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream NapkinContent — the body, script. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
