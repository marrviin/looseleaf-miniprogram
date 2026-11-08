import { createComponent } from '../../common/component';
import { props, validators } from './props';

/** ll-sidebar-menu-sub-button — upstream `SidebarMenuSubButton`: the
    sub-row's link. The current one is bold on the highlighter. 28px high
    for one line; a wrapping title makes its row taller instead of running
    over the next one. */
createComponent({
  options: { styleIsolation: 'isolated', virtualHost: true },
  properties: props,
  data: { sizeCls: 'md' },
  observers: {
    size(v) {
      this.setData({ sizeCls: validators.size.includes(v) ? v : 'md' });
    },
  },
});
