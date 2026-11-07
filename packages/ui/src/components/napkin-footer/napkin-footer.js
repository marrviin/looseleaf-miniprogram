import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream NapkinFooter — pinned to the bottom, soft ink. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
