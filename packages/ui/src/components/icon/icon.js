import { createComponent } from '../../common/component';
import { props } from './props';
import { drawSkeleton, icons, resolveIconName } from '../../common/ink-engine';
import { resolvePaint } from '../../common/ink';

/** Upstream icon.tsx's fallback for unknown names — a hand-drawn box with a
    question mark (three parts: square, question-mark stroke, dot). */
const MISSING = {
  grid: 24,
  kind: 'icon',
  parts: [
    ['s', 'M4.6 4.8 L19.3 4.5 L19.5 19.2 L4.4 19.5 Z', 0.9],
    ['s', 'M9.4 9.6 Q9.6 7.4 12.1 7.4 Q14.7 7.5 14.6 9.7 Q14.5 11.4 12.3 12.3 L12.1 14', 1.1],
    ['d', 12, 16.8, 1.1],
  ],
};

const UI_WEIGHT = 1.12;
const UI_WEIGHT_MAX_PX = 20;
const iconNib = (def, px) => Math.min(3.4, Math.max(1.45, px * (def.nibK ?? 0.068)));

// Same memo key upstream icon.tsx uses — one drawing per
// (name, size, tone, accent, seed, weight) across every instance.
const CACHE = new Map();

/** Upstream `Icon` — drawSkeleton on the ArtDef map, no recipe pipeline.
    The skeleton SVG is wrapped in a padded viewBox (toSvg's pad covers the
    stroke overhang) and painted as a data URI on an art layer that bleeds
    -pad px past the box, so the hand-drawn overhang stays visible like the
    upstream `overflow-visible` svg. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    px: 16,
    artStyle: '',
    flipStyle: '',
    missing: false,
  },
  lifetimes: {
    attached() {
      this.__draw();
    },
  },
  observers: {
    'name, size, tone, accent, seed, weight, flip, ink'() {
      this.__draw();
    },
  },
  methods: {
    __draw() {
      const d = this.data;
      const id = resolveIconName(d.name || '');
      const known = icons[id];
      const def = known || MISSING;
      const px = Math.max(8, Math.round(Number(d.size) || 16));
      const k = Number(d.weight) || (d.tone === 'ui' && px <= UI_WEIGHT_MAX_PX ? UI_WEIGHT : 1);
      const key = `icon|${id}|${px}|${d.tone}|${d.accent || ''}|${d.seed || ''}|${k}|${d.ink || ''}`;

      let res = CACHE.get(key);
      if (!res) {
        res = drawSkeleton(def, px, d.seed || id, {
          tone: d.tone,
          accent: d.accent || undefined,
          kind: 'icon',
          ...(k === 1 ? {} : { nib: iconNib(def, px) * k }),
        });
        if (CACHE.size > 300) CACHE.clear();
        CACHE.set(key, res);
      }

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-res.pad} ${-res.pad} ${res.w + res.pad * 2} ${res.h + res.pad * 2}">${resolvePaint(res.svg, d.ink)}</svg>`;
      const axis = d.flip === true || d.flip === 'true' ? 'x' : d.flip;
      const flipStyle =
        known && def.mirror && axis === 'x'
          ? 'transform:scaleX(-1);'
          : known && def.mirror && axis === 'y'
            ? 'transform:scaleY(-1);'
            : '';

      this.setData({
        px,
        artStyle: `background-image:url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}");top:${-res.pad}px;left:${-res.pad}px;right:${-res.pad}px;bottom:${-res.pad}px;`,
        flipStyle,
        missing: !known,
      });
    },
  },
});
