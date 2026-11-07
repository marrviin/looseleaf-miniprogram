import { createComponent } from '../../common/component';

/** Upstream menu-styles.ts parseShortcut: "⌘S" is two keys, "⇧⌘P" three
    ("⌘" is the drawn command glyph), "Ctrl+K" two, "F2" one. */
const SYMBOL = {
  '⌘': { icon: 'command', label: 'Command' },
  '⇧': { text: 'Shift' },
  '⌥': { text: 'Alt' },
  '⌃': { text: 'Ctrl' },
  '↵': { text: 'Enter' },
  '⏎': { text: 'Enter' },
  '⌫': { text: 'Del' },
  '⎋': { text: 'Esc' },
  '⇥': { text: 'Tab' },
  '␣': { text: 'Space' },
};

function parseShortcut(input) {
  const s = String(input ?? '').trim();
  if (!s) return [];
  let parts;
  if (s.includes('+') && s.length > 1) parts = s.split('+').filter(Boolean);
  else if (/\s/.test(s)) parts = s.split(/\s+/);
  else if (Array.from(s).some((c) => c in SYMBOL)) parts = Array.from(s);
  else parts = [s];
  return parts.map((p) => SYMBOL[p] || { text: p });
}

/** ll-dropdown-menu-shortcut — MENU_SHORTCUT: keys at the end of a row,
    drawn as keycaps. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    /** Shortcut string: "⇧⌘P", "⌘B", "Ctrl+K", "F2". */
    text: {
      type: String,
      value: '',
      observer: '__parse',
    },
    customStyle: String,
  },
  data: {
    keys: [],
  },
  lifetimes: {
    attached() {
      this.__parse(this.data.text);
    },
  },
  methods: {
    __parse(text) {
      this.setData({ keys: parseShortcut(text) });
    },
  },
});
