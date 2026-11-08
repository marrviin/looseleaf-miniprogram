import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-sidebar-group — upstream `SidebarGroup`: a section of the pad. */
createComponent({
  options: { styleIsolation: 'isolated', virtualHost: true },
  properties: props,
});
