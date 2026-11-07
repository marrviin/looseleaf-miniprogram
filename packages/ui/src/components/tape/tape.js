import { createComponent } from '../../common/component';
import { props } from './props';
import { tape, tiltFor } from '../../common/ink-engine';
import { svgDataUri } from '../../common/ink';

/** Upstream dropShadow('tape') flattened (--ll-shade #3a2c1e). */
const DROP_TAPE = 'drop-shadow(0 0.6px 0.8px rgba(58,44,30,0.18))';

const clamp5 = (v) => Math.max(-5, Math.min(5, v));

/** Upstream `Tape` — a decorative strip drawn by the paper props' own
    `tape()` InkResult (not a recipe): one fixed-size SVG at length × height
    with its ends' teeth bleeding pad px past the box. Rotate: the seeded
    angle (±4) or the prop, clamped like a sheet's tilt (±5deg, upstream
    clamp(calc(--ll-tilt-max * -2.5), deg, 2.5 * --ll-tilt-max)). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    w: 72,
    h: 22,
    deg: 0,
    artStyle: '',
  },
  lifetimes: {
    attached() {
      this.__draw();
    },
  },
  observers: {
    'kind, length, height, angle, ends, color, seed'() {
      this.__draw();
    },
  },
  methods: {
    __draw() {
      const d = this.data;
      const seed = String(d.seed ?? '');
      const res = tape(`${seed ? seed : 'll-tape'}|tape`, {
        kind: d.kind,
        length: Number(d.length) || 72,
        height: Number(d.height) || 22,
        ...(d.ends ? { ends: d.ends } : {}),
        ...(d.color ? { color: d.color } : {}),
      });
      const asked = Number(d.angle);
      const deg =
        Number.isFinite(asked) && d.angle !== ''
          ? clamp5(asked)
          : clamp5(tiltFor(`${seed || 'll-tape'}|tape`, 4));
      this.setData({
        w: res.w,
        h: res.h,
        deg,
        artStyle: `inset:${-res.pad}px;background-image:url("${svgDataUri(res.svg, res)}");`,
      });
    },
  },
});
