import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `AvatarImage` — the picture, round, object-cover. Radix shows it
    once loaded and the fallback until then or on failure; here the fallback
    simply sits under the image (it is opaque once loaded) and this component
    removes itself on a load error, revealing the fallback. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    failed: false,
  },
  methods: {
    __onError() {
      this.setData({ failed: true });
    },
  },
});
