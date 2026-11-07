import { createComponent } from '../../common/component';

/** Upstream IndexCardFooter — small muted print at the foot. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
