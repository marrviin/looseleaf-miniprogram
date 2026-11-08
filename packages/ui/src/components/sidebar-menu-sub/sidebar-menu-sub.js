import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-sidebar-menu-sub — upstream `SidebarMenuSub`: the indented nested
    list under a row. One small drawing per open sub-menu: the sidebar-rule
    recipe pencils a wobbly line down the list's start edge (the ink layer
    sits inset by the recipe pad like every ll-* host). Hidden entirely
    when the pad collapses to icons. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    collapsed: false,
    llInkRecipe: 'sidebar-rule',
    llInkSelector: '.ll-sidebar-menu-sub',
  },
  methods: {
    __onSidebar(ctx) {
      this.setData({ collapsed: !!ctx.collapsed });
    },
  },
});
