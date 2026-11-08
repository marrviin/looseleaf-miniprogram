import { createComponent } from '../../common/component';

/** ll-command-shortcut — upstream CommandShortcut: the keys for a command
    at the end of its row; the text becomes a pencil keycap (Kbd). A chord
    (several keycaps) goes in the slot instead. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
    multipleSlots: true,
  },
  properties: {
    /** The keys ("Ctrl S") — one keycap, like upstream's string child. */
    text: {
      type: String,
      value: '',
    },
    customStyle: String,
  },
});
