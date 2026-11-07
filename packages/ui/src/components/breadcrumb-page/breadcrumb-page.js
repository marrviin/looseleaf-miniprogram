import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `BreadcrumbPage` — the underline is the only drawing in a
    breadcrumb; the recipe runs at the measured text size. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'breadcrumb-page',
  },
});
