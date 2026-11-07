import { createComponent } from '../../common/component';
import { props } from './props';
import { drawSkeleton, doodles } from '../../common/ink-engine';
import { svgDataUri } from '../../common/ink';

/** Upstream `Doodle` — drawSkeleton on the doodles map, tone 'doodle'
    (line-led with one flat fill). The box is the square size; the art layer
    bleeds -pad px past it so the stroke overhang stays visible, like the
    upstream overflow-visible svg. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    px: 96,
    tf: '',
    artStyle: '',
    has: false,
  },
  lifetimes: {
    attached() {
      this.__draw();
    },
  },
  observers: {
    'name, size, accent, seed, rotate, flip'() {
      this.__draw();
    },
  },
  methods: {
    __draw() {
      const d = this.data;
      const def = doodles[d.name];
      if (!def) {
        this.setData({ has: false, artStyle: '' });
        return;
      }
      const px = Math.max(24, Math.round(Number(d.size) || 96));
      const res = drawSkeleton(def, px, String(d.seed || d.name), {
        tone: 'doodle',
        ...(d.accent ? { accent: d.accent } : {}),
        kind: 'doodle',
      });
      const deg = Number(d.rotate) || 0;
      const tf =
        (deg ? `rotate(${deg}deg)` : '') +
        (d.flip === true || d.flip === 'true' ? ' scaleX(-1)' : '');
      this.setData({
        has: true,
        px,
        tf: tf ? `transform:${tf};` : '',
        artStyle: `inset:${-res.pad}px;background-image:url("${svgDataUri(res.svg, res)}");`,
      });
    },
  },
});
