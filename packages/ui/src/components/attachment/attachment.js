import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { svgDataUri } from '../../common/ink';
import { clip } from '../../common/ink-engine';
import { props } from './props';

const DROP_PROP =
  'drop-shadow(0 1px 0.8px rgba(58,44,30,0.3)) drop-shadow(0 3px 2.4px rgba(58,44,30,0.16))';

/** Upstream `Attachment` — a slip of paper (horizontal) or a taped photo
    (vertical) holding a file. The attachmentRecipe draws the outline per
    state (idle: a dashed pencil slot; error: red wash + box; otherwise a
    pencil box, fainter when done); the sheet behind is ll-paper in the
    slip/photo stock. The clipped done state pins a small fastener clip
    top-right like the web build's Fastener. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    state: 'done',
    orientation: 'horizontal',
    size: 'default',
    sheetSeed: '',
    showTape: false,
    tapeSeed: '',
    showClip: false,
    clipStyle: '',
    clipPad: 3,
    llInkRecipe: 'attachment',
    llInkSelector: '.ll-attachment',
  },
  observers: {
    'state, orientation, size, seed'() {
      this.__apply();
    },
  },
  relations: {
    '../attachment-media/attachment-media': { type: 'descendant' },
    '../attachment-title/attachment-title': { type: 'descendant' },
    '../attachment-description/attachment-description': { type: 'descendant' },
  },
  lifetimes: {
    attached() {
      ensureHandFont();
      this.__apply();
    },
  },
  methods: {
    __apply() {
      const d = this.data;
      const state = d.state || 'done';
      const orientation = d.orientation || 'horizontal';
      const size = d.size || 'default';
      const seed = String(d.seed ?? '');
      // Never echo the watched fields back verbatim — the observer re-fires
      // on every setData that touches them (same value included) and the
      // page hard-loops. Only write them when normalization changed one.
      const patch = {
        sheetSeed: `${seed}|sheet`,
        showTape: state === 'done' && orientation === 'vertical',
        tapeSeed: `${seed}|tape`,
        showClip: state === 'done' && orientation === 'horizontal' && size === 'default',
      };
      if (d.state !== state) patch.state = state;
      if (d.orientation !== orientation) patch.orientation = orientation;
      if (d.size !== size) patch.size = size;
      this.setData(patch);
      this.__inkParams = { state, orientation, interactive: true };
      setTimeout(() => {
        this.__measureInk && this.__measureInk();
        this.__renderClip(seed);
        this.__push();
      }, 0);
    },
    /** The fastener clip (upstream Fastener kind="clip" size 30 at
        -top-3 end-1.5): a fixed-size prop drawing, art bleeding -pad.
        Parked 24px inboard — this webview won't paint a small absolutely
        positioned prop inside the actions' stacking zone at the right
        edge (z-index and DOM order both lose there), so end-1.5 is out. */
    __renderClip(seed) {
      if (!this.data.showClip) {
        if (this.data.clipStyle) this.setData({ clipStyle: '' });
        return;
      }
      const res = clip(`${seed || 'll-attachment'}|clip`, { height: 30 });
      this.setData({
        clipPad: res.pad,
        clipStyle: `top:-12px;right:24px;width:${res.w}px;height:${res.h}px;background-image:url("${svgDataUri(res.svg, res)}");${DROP_PROP ? 'filter:' + DROP_PROP + ';' : ''}`,
      });
    },
    __push() {
      const nodes = [
        ...(this.getRelationNodes('../attachment-media/attachment-media') || []),
        ...(this.getRelationNodes('../attachment-title/attachment-title') || []),
        ...(this.getRelationNodes('../attachment-description/attachment-description') || []),
      ];
      for (const n of nodes) n.__onAttachment && n.__onAttachment({ state: this.data.state });
    },
  },
});
