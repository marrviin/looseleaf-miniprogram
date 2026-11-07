import { createComponent } from '../../common/component';
import { props, validators } from './props';
import { edgeTile, hatchTile, circleTile, SKELETON_FRAMES } from '../../common/ink-engine';
import { hashSeed } from '../../common/ink';
import TOKENS from '../../common/tokens';

// Upstream skeletonCss() bakes the twelve tiles (3 boil frames × edge-h /
// edge-v / hatch / circle) into a stylesheet as CSS custom properties. Here
// the component sets them as inline custom properties on the root instead —
// the wxss keyframes reference them with var(). The tiles are constants:
// compute them once per process.
let FRAMES = null;

function frames() {
  if (!FRAMES) {
    FRAMES = Array.from({ length: SKELETON_FRAMES }, (_, f) => ({
      eh: edgeTile(`skeleton|edge-h|${f}`, false),
      ev: edgeTile(`skeleton|edge-v|${f}`, true),
      ha: hatchTile(`skeleton|hatch|${f}`),
      ci: circleTile(`skeleton|circle|${f}`),
    }));
  }
  return FRAMES;
}

// Upstream: background-color: color-mix(in srgb, var(--ll-paper-shade) 55%,
// transparent) — color-mix is unsupported in the miniprogram webview, so
// precompute the rgba from the token hex.
const SHADE_BG = (() => {
  const hex = TOKENS['--ll-paper-shade'] || '#ece6da';
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},0.55)`;
})();

/** Upstream `Skeleton` — a pale pencil hatch inside a rough outline that
    redraws itself slowly (three frames, each instance starting at its own
    phase). The shape is whatever the classes say; here width/height/border
    radius come in through custom-style, `round` is the circle. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    rootStyle: '',
  },
  lifetimes: {
    attached() {
      this.__draw();
    },
  },
  observers: {
    'seed, round'() {
      this.__draw();
    },
  },
  methods: {
    __draw() {
      const d = this.data;
      const round = validators.round.includes(d.round) ? d.round === true || d.round === 'true' : false;
      // Phase from the seed (upstream: hashSeed(useId) % SKELETON_FRAMES); a
      // bare seed still spreads phases across instances via the webview id.
      const key = d.seed || `skeleton|${this.__wxWebviewId__ ?? 0}`;
      const phase = hashSeed(key) % SKELETON_FRAMES;
      const vars = frames()
        .map(
          (f, i) =>
            `--ll-sk-eh${i}:${f.eh};--ll-sk-ev${i}:${f.ev};--ll-sk-ha${i}:${f.ha};--ll-sk-ci${i}:${f.ci};`
        )
        .join('');
      this.setData({
        rootStyle: `${vars}--ll-sk-phase:${phase};background-color:${SHADE_BG};${round ? 'border-radius:9999px;' : ''}${d.customStyle || ''}`,
      });
    },
  },
});
