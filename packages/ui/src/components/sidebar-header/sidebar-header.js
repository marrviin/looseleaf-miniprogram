import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-sidebar-header — upstream `SidebarHeader`: the top of the pad, a column with 8px padding. */
createComponent({
  options: { styleIsolation: 'isolated', virtualHost: true },
  properties: props,
});
