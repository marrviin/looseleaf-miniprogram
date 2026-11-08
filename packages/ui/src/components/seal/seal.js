import { createComponent } from '../../common/component';
import { sealArt } from '../../common/ink-engine';
import { svgDataUri, hashSeed } from '../../common/ink';
import { props, validators } from './props';

/** Upstream autoTilt — a seed-derived swing. */
const autoTilt = (seed) => ((hashSeed(seed) % 640) - 320) / 100;

/** Upstream tilt style clamps the auto swing to ±1.6 × --ll-tilt-max (2deg). */
const TILT_CLAMP = 3.2;

function describe(p) {
  if (p.text) return p.sub ? `${p.text}, ${p.sub}` : p.text;
  if (p.mark === 'check') return 'Verified';
  if (p.mark === 'star') return 'Award';
  return `${p.variant} seal`;
}

/** Upstream `Seal` — intrinsic art from the badge generator plus a ringed
    seal and a wax one, drawn at its `size` (not scaled), one svg per
    (params, px, seed, tier). No recipe pipeline: the component calls
    sealArt directly and mounts the result as a data-URI background. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    px: 96,
    has: false,
    shadowed: true,
    artStyle: '',
  },
  lifetimes: {
    attached() {
      this.__draw();
    },
  },
  observers: {
    'variant, text, sub, mark, tone, ribbon, ring, deco, size, tier, seed'() {
      this.__draw();
    },
  },
  methods: {
    __draw() {
      const d = this.data;
      const variant = validators.variant.includes(d.variant) ? d.variant : 'scallop';
      const mark = validators.mark.includes(d.mark) ? d.mark : undefined;
      const params = {
        variant,
        text: d.text || undefined,
        sub: d.sub || undefined,
        mark,
        tone: d.tone || undefined,
        ribbon: d.ribbon || undefined,
        ring: d.ring || undefined,
        deco: d.deco || undefined,
      };
      const s = `${d.seed ?? `${variant}:${d.text || mark || ''}`}`;
      const px = Math.max(16, Math.round(Number(d.size) || 96));
      const res = sealArt(params, px, s, d.tier === 'hi' ? 'hi' : 'lo');
      let deg = 0;
      if (d.tilt === true || d.tilt === 'auto') deg = Math.max(-TILT_CLAMP, Math.min(TILT_CLAMP, autoTilt(s)));
      else if (typeof d.tilt === 'number') deg = d.tilt;
      else if (typeof d.tilt === 'string' && d.tilt !== '' && d.tilt !== 'false' && !isNaN(Number(d.tilt))) deg = Number(d.tilt);
      const rotate = deg ? `transform:rotate(${deg}deg);` : '';
      const label = d.decorative === true || d.decorative === 'true' ? '' : d.label || describe(params);
      this.setData({
        has: true,
        px: res.w,
        artStyle: `inset:${-res.pad}px;background-image:url("${svgDataUri(res.svg, res)}");${rotate}`,
        shadowed: !(d.shadow === false || d.shadow === 'false'),
        ariaRole: label ? 'img' : 'none',
        ariaHidden: label ? 'false' : 'true',
        ariaLabel: label,
      });
    },
  },
});
