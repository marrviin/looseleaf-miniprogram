import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-sidebar-menu-item — upstream `SidebarMenuItem`: one row (li), a
    relative group. It relays state down: `collapsed` arrives from
    ll-sidebar (via __onSidebar) and the row's parity from ll-sidebar-menu
    (via __onMenu, which assigns indices in link order). Both fan out to the
    row's ll-sidebar-menu-button / -action / -badge children — the pad's
    alternating ruling mask hangs off the parity. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    collapsed: false,
    parity: 0,
  },
  relations: {
    '../sidebar-menu-button/sidebar-menu-button': { type: 'descendant' },
    '../sidebar-menu-action/sidebar-menu-action': { type: 'descendant' },
    '../sidebar-menu-badge/sidebar-menu-badge': { type: 'descendant' },
  },
  methods: {
    /** From ll-sidebar: the pad collapsed to icons. */
    __onSidebar(ctx) {
      this.setData({ collapsed: !!ctx.collapsed });
      this.__push();
    },
    /** From ll-sidebar-menu: this row's index (for the odd/even ruling). */
    __onMenu(idx) {
      this.setData({ parity: idx % 2 });
      this.__push();
    },
    __push() {
      const ctx = { collapsed: this.data.collapsed, parity: this.data.parity };
      ['../sidebar-menu-button/sidebar-menu-button', '../sidebar-menu-action/sidebar-menu-action', '../sidebar-menu-badge/sidebar-menu-badge'].forEach((path) => {
        (this.getRelationNodes(path) || []).forEach((c) => c.__onItem && c.__onItem(ctx));
      });
    },
  },
});
