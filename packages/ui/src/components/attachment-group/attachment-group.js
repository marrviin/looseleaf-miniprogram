import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `AttachmentGroup` — prints scroll sideways and snap when
    they're wider than the box. A scroll-view with snap. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
