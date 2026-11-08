import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-sidebar-group-action — upstream `SidebarGroupAction`: a small button
    at the end of the group's label row. Tap is caught (the label under it
    may be a collapsible trigger) and re-emitted. Hidden when collapsed. */
createComponent({
  options: { styleIsolation: 'isolated', virtualHost: true },
  properties: props,
  data: { collapsed: false },
  methods: {
    __onSidebar(ctx) {
      this.setData({ collapsed: !!ctx.collapsed });
    },
    noop() {
      /* native tap bubbles to the page (or a dropdown trigger slot) */
    },
  },
});
