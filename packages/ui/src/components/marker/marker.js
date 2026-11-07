import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Marker` — a flex row: `separator` pulls a pencil line on each
    side of the words, `border` one under them, `default` is small print.
    The lines are aria-hidden drawings (ll-marker-rule) that never affect
    layout or reading order. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
