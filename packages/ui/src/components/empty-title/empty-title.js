import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { props } from './props';

ensureHandFont();

/** Upstream `EmptyTitle` — the headline in the script font at 26px. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
