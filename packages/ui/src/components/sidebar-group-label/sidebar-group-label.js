import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-sidebar-group-label — upstream `SidebarGroupLabel`: the section's
    heading, in the typewriter. Fades and closes up when the pad collapses
    to icons (state arrives from ll-sidebar through the relation). */
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
