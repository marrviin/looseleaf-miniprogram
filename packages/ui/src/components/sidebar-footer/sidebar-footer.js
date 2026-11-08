import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-sidebar-footer — upstream `SidebarFooter`: the bottom of the pad, a column with 8px padding. */
createComponent({
  options: { styleIsolation: 'isolated', virtualHost: true },
  properties: props,
});
