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

const TILE_PX = [240, 192, 128, 720]; // fibre, relief, slip, cloud (upstream cssWidth)

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    paperStyle: '',
  },
  lifetimes: {
    attached() {
      this.__updatePaper();
    },
  },
  observers: {
    'seed, stock, tilt'() {
      this.__updatePaper();
    },
  },
  methods: {
    /** Per-seed texture offsets (upstream offsetFor) and the small sheet tilt
        (upstream tiltFor, max 0.5deg for the card stock). Pure CSS painting:
        cut-edge cards draw no sheet ink upstream. */
    __updatePaper() {
      const d = this.data;
      const seed = d.seed ?? '';
      const pos = TILE_PX.map((px, i) => {
        const a = hash32(`${seed}:${i}`);
        const x = -(a % px);
        const y = -((a >>> 11) % px);
        return `${x * 2}rpx ${y * 2}rpx`;
      }).join(', ');
      let style = `background-position:${pos}, 0 0;`;
      if (d.tilt) {
        const t = hash32(`tilt:${seed}`);
        const sign = t % 2 ? 1 : -1;
        const r = ((t >>> 8) % 1000) / 1000;
        const deg = Math.round(sign * 0.5 * (0.25 + 0.75 * r) * 100) / 100;
        if (deg) style += `transform:rotate(${deg}deg);`;
      }
      this.setData({ paperStyle: style });
    },
  },
});
