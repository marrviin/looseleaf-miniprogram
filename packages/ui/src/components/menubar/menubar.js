import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';

ensureHandFont();

/** ll-menubar — upstream Menubar: a desktop-style menu bar on a strip of
    paper — a pale paper-shade body under a fine felt outline with a pencil
    ruler's ticks along the foot (the `menubar` recipe, kind bar). The
    titles are ll-menubar-menu children; the bar keeps them exclusive —
    one open menu at a time (Radix roving focus + hover-to-switch; on
    touch, tapping another title while one is open switches). */
createComponent({
  options: {
    styleIsolation: 'isolated',
  },
  properties: {
    ariaLabel: String,
    customStyle: String,
  },
  data: {
    llInkRecipe: 'menubar',
    llInkSelector: '.ll-menubar',
  },
  relations: {
    '../menubar-menu/menubar-menu': {
      type: 'descendant',
      linked() {},
      unlinked() {},
    },
  },
  methods: {
    /** A menu opened — close the others (one open at a time). */
    onMenuOpen(menu) {
      const menus = this.getRelationNodes('../menubar-menu/menubar-menu') || [];
      menus.forEach((m) => {
        if (m !== menu && m.data.open) m.dismissFromBar();
      });
    },
  },
});
