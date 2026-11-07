import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `PaginationLink` — a Button (ghost, or secondary when active)
    wrapped around your link. The drawing itself is ll-button's ink layer;
    this wrapper only maps isActive → variant and forwards the label. */
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
