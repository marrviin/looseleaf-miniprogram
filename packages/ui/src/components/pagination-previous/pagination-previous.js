import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `PaginationPrevious` — a labeled link with a drawn chevron;
    the word hides on phones (hidden sm:block), the aria-label stays. */
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
