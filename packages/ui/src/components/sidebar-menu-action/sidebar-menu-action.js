import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-sidebar-menu-action — upstream `SidebarMenuAction`: a small button at
    the end of a row. Tap is caught and re-emitted (the row under it may be
    a dropdown trigger). Hidden when the pad collapses to icons. */
createComponent({
  options: { styleIsolation: 'isolated', virtualHost: true },
  properties: props,
  data: { collapsed: false },
  methods: {
    __onItem(ctx) {
      this.setData({ collapsed: !!ctx.collapsed });
    },
    __onSidebar(ctx) {
      this.setData({ collapsed: !!ctx.collapsed });
    },
    noop() {
      /* native tap bubbles to the page (or a dropdown trigger slot) */
    },
  },
});
