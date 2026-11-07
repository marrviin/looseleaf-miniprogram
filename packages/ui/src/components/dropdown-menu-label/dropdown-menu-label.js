import { createComponent } from '../../common/component';

/** ll-dropdown-menu-label — MENU_LABEL: a heading in the typewriter face,
    like the kicker of a form. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    /** data-inset: align with choice-row labels. */
    inset: {
      type: Boolean,
      value: false,
    },
    customStyle: String,
  },
});
