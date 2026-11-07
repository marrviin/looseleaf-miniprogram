import { createComponent } from '../../common/component';

/** ll-dropdown-menu-group — upstream DropdownMenuGroup: a labelled chunk of
    rows (aria-group). No behavior of its own in WeChat. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
