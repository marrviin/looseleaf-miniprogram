import { createComponent } from '../../common/component';
import { tiltFor } from '../../common/ink-engine';
import { props, validators } from './props';

const clampTilt = 1.4;

/** Upstream `Bookmark` — the toggle: rest draws the pencil ghost of the
    ribbon, checked draws the woven cloth ribbon (with the drop-sticker
    shadow), hover a wash, disabled a pale ghost. The ink layer carries the
    bookmark's own seeded tilt (upstream rotates the svg via the `rotate`
    CSS property, which composes with our hover transform; here the base
    tilt wins and the hover wash draws without the extra turn). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'bookmark-ribbon',
    llInkSelector: '.ll-bookmark-ink',
    checked: false,
    deg: 0,
  },
  lifetimes: {
    attached() {
      this.__update();
    },
  },
  observers: {
    'tone, disabled, seed, tilt'() {
      this.__update();
    },
    pressed(p) {
      // The checked layer (the ribbon) stacks over the ghost when on —
      // __applyInkLayer keys on data.checked.
      this.setData({ checked: !!p });
      setTimeout(() => this.__applyInkLayer(), 0);
    },
  },
  methods: {
    __update() {
      const d = this.data;
      const tone = validators.tone.includes(d.tone) ? d.tone : 'tomato';
      this.__inkParams = { tone, mode: 'toggle', disabled: !!d.disabled };
      // tilt: true = seeded within ±1.4; number = degrees; false = flat.
      let deg = 0;
      if (d.tilt !== false) {
        deg =
          typeof d.tilt === 'number'
            ? d.tilt
            : tiltFor(`tilt:${String(d.seed ?? '') || 'bookmark'}`, clampTilt);
      }
      this.setData({ deg, checked: !!d.pressed });
      this.__measureInk();
    },
    onTap() {
      if (this.data.disabled) return;
      const pressed = !this.data.pressed;
      this.setData({ pressed, checked: pressed });
      this.triggerEvent('change', { pressed });
    },
  },
});
