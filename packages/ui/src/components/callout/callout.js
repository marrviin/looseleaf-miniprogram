import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Callout` — a Handwritten note and an Arrow pointing from it,
    laid out per direction (upstream LAYOUT map). Pure composition: the
    text rides in a Handwritten, the tail in an Arrow sized 56×40
    (upstream h-10 w-14) with the same seed (+':arrow'). */

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
