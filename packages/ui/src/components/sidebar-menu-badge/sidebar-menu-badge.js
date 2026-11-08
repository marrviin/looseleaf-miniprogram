import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-sidebar-menu-badge — upstream `SidebarMenuBadge`: a count at the end
    of a row, written in blue felt in the script font. Hidden when the pad
    collapses to icons. */
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
  },
});
