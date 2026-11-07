import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream MarkerContent (marker.tsx) — the words. `separator` writes them
    in the script font, centered; `new` lays a highlighter swipe under them.
    WeChat style isolation can't carry the marker's tone/variant onto slotted
    children, so the marker's own modifier classes are mirrored here as
    props (the demos pass the same variant/tone as the parent marker). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
