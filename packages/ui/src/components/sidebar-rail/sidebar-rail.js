import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-sidebar-rail — upstream `SidebarRail`: a thin strip on the pad's
    page-facing edge that toggles the sidebar on click. Desktop pads only
    (upstream hidden sm:flex); not in the tab order upstream, and a plain
    view here. `side` arrives with the provider context. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    visible: false,
    side: 'left',
  },
  relations: {
    '../sidebar-provider/sidebar-provider': {
      type: 'ancestor',
      linked() {
        this.__linked = true;
      },
      unlinked() {
        this.__linked = false;
      },
    },
  },
  methods: {
    __onProvider(ctx) {
      this.setData({ side: ctx.side || 'left' });
    },
    /** From ll-sidebar: docked pads show the rail, sheets don't. */
    __onSidebar(ctx) {
      this.setData({ visible: ctx.renderMobile === false });
    },
    __provider() {
      const nodes = this.getRelationNodes('../sidebar-provider/sidebar-provider') || [];
      return nodes[0] || null;
    },
    onTap() {
      const p = this.__provider();
      if (p && p.__toggle) p.__toggle();
    },
  },
});
