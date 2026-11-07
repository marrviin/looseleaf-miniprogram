import { createComponent } from '../../common/component';
import { props } from './props';
import { ensureHandFont } from '../../common/hand-font';

/** Upstream `BreadcrumbList` — the `ol`; wraps onto several lines when the
    path is long. The hand font is set here like upstream's font-hand. */
ensureHandFont();
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
