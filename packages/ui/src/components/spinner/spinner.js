import { createComponent } from '../../common/component';
import { props, validators } from './props';
import { spinnerMark, drawMascot, mascotProps } from '../../common/ink-engine';
import { resolvePaint } from '../../common/ink';

const WRITE_FRAMES = ['write-1', 'write-2', 'write-3'];
// Upstream: scribble lap = var(--ll-dur-draw)*2 = 0.6s*2 (motion defaults to 1).
const DRAW_LAP = 1.2;

/** The scribble/loops animation lives INSIDE the data-URI SVG: upstream
    animates the mask's reveal path from CSS ([data-part=reveal], dasharray
    .42/.58, ll-draw 1→0), but CSS can't reach into a background image.
    SMIL <animate> on the same attribute does the same comet loop. */
function animateReveal(svg, dur) {
  return svg.replace(
    /<path data-part="reveal"([^>]*?)\/>/g,
    (_, attrs) =>
      `<path data-part="reveal"${attrs} stroke-dasharray=".42 .58"><animate attributeName="stroke-dashoffset" values="1;0" keyTimes="0;1" dur="${dur}s" repeatCount="indefinite" calcMode="linear"/></path>`
  );
}

function toDataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Upstream `Spinner` — a scribble comet (spiral, or loops for the long
    variant) drawn by the spinner-ink recipe, or Stubby the pencil writing
    across three flipped frames. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    boxStyle: '',
    artStyle: '',
    frames: [],
    isWrite: false,
  },
  lifetimes: {
    attached() {
      this.__draw();
    },
  },
  observers: {
    'variant, size, seed, ink'() {
      this.__draw();
    },
  },
  methods: {
    __draw() {
      const d = this.data;
      const variant = validators.variant.includes(d.variant) ? d.variant : 'scribble';
      const asked = Number(d.size);
      const px = Math.max(8, Math.round(Number.isFinite(asked) && asked > 0 ? asked : variant === 'write' ? 64 : 16));
      const seed = String(d.seed || 'spinner');

      if (variant === 'write') {
        let box = { w: 0, h: 0 };
        const frames = WRITE_FRAMES.map((id) => {
          const f = drawMascot(mascotProps.frames[id], px, seed, { idPrefix: 'll-sp' });
          if (id === 'write-1') box = { w: f.w, h: f.h };
          return {
            style: `background-image:url("${toDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-f.pad} ${-f.pad} ${f.w + f.pad * 2} ${f.h + f.pad * 2}">${resolvePaint(f.svg, d.ink)}</svg>`)}");width:${f.w + f.pad * 2}px;height:${f.h + f.pad * 2}px;top:${-f.pad}px;left:${-f.pad}px;`,
          };
        });
        this.setData({
          isWrite: true,
          frames,
          boxStyle: `width:${box.w}px;height:${box.h}px;`,
          artStyle: '',
        });
        return;
      }

      const mark =
        variant === 'loops'
          ? spinnerMark(seed, px, { shape: 'loops', w: px * 4, h: px, tier: 'lo', calm: false })
          : spinnerMark(seed, px, { tier: 'lo', calm: false });
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-mark.pad} ${-mark.pad} ${mark.w + mark.pad * 2} ${mark.h + mark.pad * 2}">${animateReveal(resolvePaint(mark.svg, d.ink), DRAW_LAP)}</svg>`;

      // scribble: a px box; loops: the mark's own w+2pad × h+2pad footprint.
      const box = variant === 'loops' ? { w: mark.w + mark.pad * 2, h: mark.h + mark.pad * 2 } : { w: px, h: px };
      this.setData({
        isWrite: false,
        frames: [],
        boxStyle: `width:${box.w}px;height:${box.h}px;`,
        artStyle: `background-image:url("${toDataUri(svg)}");top:${-mark.pad}px;left:${-mark.pad}px;right:${-mark.pad}px;bottom:${-mark.pad}px;`,
      });
    },
  },
});
