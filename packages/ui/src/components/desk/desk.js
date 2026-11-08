import { createComponent } from '../../common/component';
import { clip, coffeeRing, pin, pencil, ruler, DESK_OBJECTS } from '../../common/ink-engine';
import { svgDataUri } from '../../common/ink';
import { props } from './props';

/** Upstream `Desk` — the sage bookcloth under a lamp (linen weave + a warm
    vignette), with an optional layer of objects behind the content: a
    coffee ring, a pencil, paper clips, a ruler, push-pins (upstream
    DeskObjects, absolute + aria-hidden + z below every sheet). */

const SHADOW = 'filter:drop-shadow(0 1px 0.8px rgba(58,44,30,0.3)) drop-shadow(0 3px 2.4px rgba(58,44,30,0.16));';

/** One art piece as a view style — box padded by res.pad so the stroke
    overhang stays visible (same math as ll-paper's __propStyle). */
function artStyle(res, extra) {
  return (
    `width:${res.w + res.pad * 2}px;height:${res.h + res.pad * 2}px;` +
    `background-image:url("${svgDataUri(res.svg, res)}");` +
    `background-size:100% 100%;background-repeat:no-repeat;` +
    (extra || '')
  );
}

function buildObjects(objects, seed) {
  const s = seed ? `${seed}` : 'desk';
  return objects.map((name) => {
    switch (name) {
      case 'coffee':
        return {
          name,
          pos: 'bottom:-48px;right:-40px;',
          pieces: [artStyle(coffeeRing(`${s}:coffee`, { radius: 64 }), 'transform:rotate(6deg);')],
        };
      case 'pencil':
        return {
          name,
          pos: 'bottom:64px;left:40px;',
          pieces: [artStyle(pencil(`${s}:pencil`, { length: 200 }), 'transform:rotate(-24deg);transform-origin:left center;' + SHADOW)],
        };
      case 'clips':
        return {
          name,
          pos: 'top:20px;right:112px;',
          pieces: [
            artStyle(clip(`${s}:clip-a`, { height: 62, tone: 'steel' }), 'transform:rotate(12deg);' + SHADOW),
            artStyle(clip(`${s}:clip-b`, { height: 58, tone: 'sky' }), 'margin-top:-4px;transform:rotate(-9deg);' + SHADOW),
          ],
        };
      case 'ruler':
        return {
          name,
          pos: 'bottom:-4px;left:38%;',
          pieces: [artStyle(ruler(`${s}:ruler`, 300, { height: 30 }), 'transform:rotate(-1.4deg);' + SHADOW)],
        };
      case 'pins':
        return {
          name,
          pos: 'top:16px;left:96px;',
          pieces: [
            artStyle(pin(`${s}:pin-a`, { size: 22, color: 'tomato' }), SHADOW),
            artStyle(pin(`${s}:pin-b`, { size: 24, color: 'sky' }), 'margin-top:16px;' + SHADOW),
          ],
        };
      default:
        return null;
    }
  }).filter(Boolean);
}

/** Upstream lampVignette — the shade alpha is baked static (the webview
    drops var() inside gradients the same way it drops it in keyframes). */
function vignette(lamp) {
  if (lamp <= 0) return 'linear-gradient(transparent, transparent)';
  const a = Math.round(lamp * lamp * 0.05 * 1000) / 1000;
  return `radial-gradient(ellipse 120% 100% at 50% 40%, rgba(58,44,30,0) 60%, rgba(58,44,30,${a}))`;
}

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    deskStyle: '',
    items: [],
  },
  lifetimes: {
    attached() {
      this.__update();
    },
  },
  observers: {
    'objects, lamp, seed'() {
      this.__update();
    },
  },
  methods: {
    __update() {
      const d = this.data;
      const lampRaw = d.lamp;
      const lamp = lampRaw === true ? 1 : lampRaw === false ? 0 : typeof lampRaw === 'number' ? lampRaw : 1;
      const list = d.objects === true ? DESK_OBJECTS : Array.isArray(d.objects) ? d.objects : [];
      this.setData({
        // linen weave + vignette; the tile var is baked on .ll-desk by
        // script/bake-paper-tiles.mjs
        deskStyle: `background-image:${vignette(lamp)}, var(--ll-tex-linen);`,
        items: buildObjects(list, d.seed),
      });
    },
  },
});
