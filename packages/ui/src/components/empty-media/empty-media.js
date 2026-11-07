import { createComponent } from '../../common/component';
import { props, validators } from './props';
import { drawMascot, mascot, doodles, drawSkeleton } from '../../common/ink-engine';
import { svgDataUri } from '../../common/ink';

/** One padded data-URI style for a DieCut/Skeleton result: the box stays the
    drawing's own size (upstream svg width/height) while the background bleeds
    -pad px so the stroke overhang stays visible. */
function artStyle(res) {
  const uri = svgDataUri(res.svg, { w: res.w, h: res.h, pad: res.pad });
  return `width:${res.w}px;height:${res.h}px;margin:${-res.pad}px;background-image:url("${uri}");`;
}

/** Upstream `EmptyMedia` — the picture above the words. `pose` asks for
    Stubby, `doodle` for a doodle; anything else comes in through the slot
    (an icon, an avatar…). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    isIcon: false,
    artStyle: '',
    // Icon tile only: the slip of paper is drawn by the empty-media recipe
    // (tile kind), measured on .ll-empty-media__tile.
    llInkRecipe: '',
    llInkSelector: '.ll-empty-media__tile',
  },
  lifetimes: {
    attached() {
      this.__draw();
    },
  },
  observers: {
    'variant, pose, doodle, size, seed'() {
      this.__draw();
    },
  },
  methods: {
    __draw() {
      const d = this.data;
      const isIcon = validators.variant.includes(d.variant) ? d.variant === 'icon' : false;
      const patch = { isIcon, llInkRecipe: isIcon ? 'empty-media' : '', artStyle: '' };
      if (isIcon) setTimeout(() => this.__measureInk(), 60);

      const asked = Number(d.size);
      const px = Number.isFinite(asked) && asked > 0 ? Math.round(asked) : 0;

      // A pose wins over a doodle (upstream renders both if set; the pose box
      // includes Stubby's white sticker border).
      const pose = d.pose && mascot[d.pose] ? d.pose : '';
      if (pose) {
        const res = drawMascot(mascot[pose], px || 96, String(d.seed || pose), {
          tier: 'lo',
          idPrefix: 'll-empty',
        });
        patch.artStyle = artStyle(res);
      } else if (d.doodle && doodles[d.doodle]) {
        const res = drawSkeleton(doodles[d.doodle], px || 80, String(d.seed || d.doodle), {
          tone: 'doodle',
          kind: 'doodle',
        });
        patch.artStyle = artStyle(res);
      }
      this.setData(patch);
    },
  },
});
