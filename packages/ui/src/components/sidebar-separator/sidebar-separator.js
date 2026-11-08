import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-sidebar-separator — upstream `SidebarSeparator`: a pencil rule (the
    Separator component) with the pad's side margins. */
createComponent({
  options: { styleIsolation: 'isolated', virtualHost: true },
  properties: props,
});
