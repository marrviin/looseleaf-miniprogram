import { createComponent } from '../../common/component';

/** Upstream `NotebookTitle` — an h2 in the script font, one ruled line
    high, lifted to stand on its rule. `as` is not portable — the root is
    a view with aria-role heading. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
