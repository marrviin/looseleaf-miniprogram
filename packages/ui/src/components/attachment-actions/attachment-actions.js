import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `AttachmentActions` — the trailing button row; floats over the
    photo on a vertical print. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
