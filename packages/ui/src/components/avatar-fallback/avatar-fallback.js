import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { avatarTone } from '../../common/ink-engine';
import { props } from './props';

ensureHandFont();

/** Upstream `initials` — first letter of the first and last word, uppercased. */
export function initials(name) {
  const words = String(name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return '';
  const first = Array.from(words[0])[0] ?? '';
  const last = words.length > 1 ? (Array.from(words[words.length - 1])[0] ?? '') : '';
  return (first + last).toUpperCase();
}

const TONES = ['tomato', 'tangerine', 'lemon', 'grass', 'teal', 'sky', 'grape', 'bubblegum'];

/** Upstream `AvatarFallback` — the initials disc: a blob of marker in a
    stationery color picked from the name (avatarTone — the same person is the
    same color everywhere), drawn by the avatar-fallback recipe. With a name
    and no other content the initials are made for you; otherwise render the
    slot. `tone` overrides the color the name picks. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'avatar-fallback',
    shown: '',
  },
  lifetimes: {
    attached() {
      this.__apply();
    },
  },
  observers: {
    'name, tone'() {
      this.__apply();
    },
  },
  methods: {
    __apply() {
      const { name, tone } = this.data;
      const t = TONES.includes(tone) ? tone : avatarTone(name);
      this.__inkParams = () => ({ tone: t });
      // Upstream seeds the drawing with the name when no explicit seed —
      // the same person's disc is the same drawing everywhere too.
      if (!this.data.seed && name) this.setData({ seed: name, shown: initials(name) });
      else this.setData({ shown: initials(name) });
      setTimeout(() => this.__measureInk(), 60);
    },
  },
});
