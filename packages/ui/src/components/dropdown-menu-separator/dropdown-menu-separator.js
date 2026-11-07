import { createComponent } from '../../common/component';

/** ll-dropdown-menu-separator — MENU_SEPARATOR wraps the Separator (the
    hand-drawn pencil rule) with my-1.5 margins. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
