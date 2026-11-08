import { createComponent } from '../../common/component';

/** ll-drawer-header — title + description column. Centered for top and
    bottom drawers (`centered`), left for the side slips. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    centered: {
      type: Boolean,
      value: false,
    },
    customStyle: String,
  },
});
