import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-sidebar-menu-sub-item — upstream `SidebarMenuSubItem`: one sub-row (li). */
createComponent({
  options: { styleIsolation: 'isolated', virtualHost: true },
  properties: props,
});
