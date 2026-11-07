import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { props } from './props';

ensureHandFont();

/** Upstream textures.ts hash32 (FNV-1a + murmur-style avalanche). */
function hash32(seed) {
  let h = 0x811c9dc5;
  const s = String(seed);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 16;
  return h >>> 0;
}

const EYELET = 18; // upstream TAG.eyelet

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'label-tag',
    // recipe id is 'label-tag'; the root class is .ll-tag
    llInkSelector: '.ll-tag',
    tagStyle: '',
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({
        stock: this.data.stock,
        shape: this.data.shape === 'default' ? undefined : this.data.shape,
        string: this.data.string,
        twine: this.data.twine,
        eyelet: this.data.eyelet,
      });
      this.__updateTag();
    },
  },
  observers: {
    'stock, shape, string, twine, eyelet, tilt, seed'() {
      this.__inkParams = () => ({
        stock: this.data.stock,
        shape: this.data.shape === 'default' ? undefined : this.data.shape,
        string: this.data.string,
        twine: this.data.twine,
        eyelet: this.data.eyelet,
      });
      this.__updateTag();
      setTimeout(() => this.__measureInk(), 60);
    },
  },
  methods: {
    /** The sheet swings on its eyelet (upstream pivot + tiltFor, max 2deg) and
        the layout reserves the string's length above (vertical) or before
        (luggage) the tag. */
    __updateTag() {
      const d = this.data;
      const horizontal = d.shape === 'luggage';
      // upstream: pad = string + 14, pivot = pad + eyelet (+2 for round/luggage)
      const pad = d.string + 14 + EYELET + (horizontal || d.shape === 'round' ? 2 : 0);
      let style = horizontal
        ? `margin-left:${d.string * 2}rpx;transform-origin:${pad * 2}rpx 50%;`
        : `margin-top:${d.string * 2}rpx;transform-origin:50% ${pad * 2}rpx;`;
      let deg = 0;
      if (d.tilt === true) {
        const t = hash32(`tilt:${d.seed ?? ''}`);
        const sign = t % 2 ? 1 : -1;
        const r = ((t >>> 8) % 1000) / 1000;
        deg = Math.round(sign * 2 * (0.25 + 0.75 * r) * 100) / 100;
      } else if (typeof d.tilt === 'number') {
        deg = d.tilt;
      }
      if (deg) style += `transform:rotate(${deg}deg);`;
      this.setData({ tagStyle: style });
    },
  },
});
