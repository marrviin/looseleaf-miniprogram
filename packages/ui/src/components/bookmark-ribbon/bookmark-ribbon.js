import { createComponent } from '../../common/component';
import { tiltFor } from '../../common/ink-engine';
import { props, validators } from './props';

const clampTilt = 1.4;

/** Upstream `BookmarkRibbon` — the static ribbon: mode="static" draws the
    woven cloth ribbon in the rest layer (no ghost, no hover), aria-hidden,
    with the drop-sticker shadow. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'bookmark-ribbon',
    llInkSelector: '.ll-bookmark-ink',
    deg: 0,
  },
  lifetimes: {
    attached() {
      this.__update();
    },
  },
  observers: {
    'tone, seed, tilt'() {
      this.__update();
    },
  },
  methods: {
    __update() {
      const d = this.data;
      const tone = validators.tone.includes(d.tone) ? d.tone : 'tomato';
      this.__inkParams = { tone, mode: 'static', disabled: false };
      let deg = 0;
      if (d.tilt !== false) {
        deg =
          typeof d.tilt === 'number'
            ? d.tilt
            : tiltFor(`tilt:${String(d.seed ?? '') || 'bookmark'}`, clampTilt);
      }
      this.setData({ deg });
      this.__measureInk();
    },
  },
});
