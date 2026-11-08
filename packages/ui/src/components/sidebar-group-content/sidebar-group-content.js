import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-sidebar-group-content — upstream `SidebarGroupContent`: wraps a group's menu. */
createComponent({
  options: { styleIsolation: 'isolated', virtualHost: true },
  properties: props,
});
