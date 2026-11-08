import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-sidebar-content — upstream `SidebarContent`: the scrolling middle.
    It does not scroll when the pad collapses to icons. */
createComponent({
  options: { styleIsolation: 'isolated', virtualHost: true },
  properties: props,
  data: { collapsed: false },
  methods: {
    __onSidebar(ctx) {
      this.setData({ collapsed: !!ctx.collapsed });
    },
  },
});
