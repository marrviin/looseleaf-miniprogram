import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream MarkerIcon (marker.tsx) — a 16px slot for an icon before the
    words; `new` tone reddens it (group-data-[tone=new]:text-red). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
