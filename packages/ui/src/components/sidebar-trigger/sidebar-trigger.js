import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-sidebar-trigger — upstream `SidebarTrigger`: a ghost icon button that
    toggles the pad (the sheet on phones). The provider is an ancestor —
    pull it through the relation and call __toggle(). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
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
    __onProvider() {
      /* context pushed by the provider — nothing to render from it */
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
