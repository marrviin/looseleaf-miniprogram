import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Polaroid` — a Paper (photo stock, no printed rules) as a flex
    column: window + caption. Photographs are turned more than paper (the
    photo stock tilts up to 1.5deg). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
