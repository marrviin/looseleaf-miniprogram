import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { attachInk } from '../../common/ink';

ensureHandFont();

/** ll-kbd — upstream Kbd: a hand-drawn keycap (kbd-ink's rounded box with
    a pressed depth) with a key name or a drawn glyph inside. Menu
    shortcuts override the size to h-5/min-w-5 via the `size` prop
    (MENU_KEYCAP); the recipe draws at whatever box it measures. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  behaviors: [attachInk()],
  properties: {
    /** The key name ("Shift", "F2", "D"). A drawn glyph can be slotted in
        with `icon` instead (the command key). */
    text: {
      type: String,
      value: '',
    },
    /** Draw a skeleton icon instead of text ("command"). */
    icon: {
      type: String,
      value: '',
    },
    /** 'default' (h-6/min-w-6) | 'sm' (menu keycap, h-5/min-w-5). */
    size: {
      type: String,
      value: 'default',
    },
    customStyle: String,
  },
  data: {
    llInkRecipe: 'kbd',
  },
});
