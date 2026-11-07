import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `PaginationNext` — same as Previous, pointing on. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  methods: {
    /** ll-button swallows the native tap; re-emit it for the page. */
    onTap(e) {
      this.triggerEvent('tap', e.detail);
    },
  },
});
