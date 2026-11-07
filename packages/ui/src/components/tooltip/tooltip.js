import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { svgDataUri } from '../../common/ink';
import { pointerMark } from '../../common/ink-engine';

ensureHandFont();

/** Upstream TooltipContent: a sticky-note Paper (sticky-yellow, rules none)
    with a felt-tip arrow (pointerMark 18x16 + 3pad → 24x22 box), z
    --ll-z-popover, w-fit max-w-[min(22rem,calc(100vw-1rem))], px-2.5 py-1.5
    text-sm/snug, fade+zoom-95+slide-from-side-2 over --ll-dur-pop (0.18s).
    sideOffset 1 + the arrow's box fill the gap to the trigger.
    Touch adaptation: Radix opens on hover — WeChat has none, so the note
    opens on long-press and closes on the next tap anywhere (or via the
    controlled `open` prop; skipDelayDuration has no equivalent). */
const MARGIN = 8; // collisionPadding
const ARROW_W = 24; // res.w 18 + pad*2 3
const ARROW_H = 22; // res.h 16 + pad*2 3

/** The drawn pointer faces DOWN; the box rotates per side (Radix's
    --radix-tooltip-arrow-transform). -18/-20 = box minus the 4px overlap. */
const ARROW_AT = {
  bottom: 'top:-18px;left:50%;margin-left:-12px;transform:rotate(180deg);',
  top: 'bottom:-18px;left:50%;margin-left:-12px;',
  right: 'left:-20px;top:50%;margin-top:-11px;transform:rotate(90deg);',
  left: 'right:-20px;top:50%;margin-top:-11px;transform:rotate(-90deg);',
};
/** align start/end shifts the arrow off the edge midpoint. */
function arrowAlign(side, align) {
  if (align === 'start' && (side === 'bottom' || side === 'top')) return 'left:16px;margin-left:0;';
  if (align === 'end' && (side === 'bottom' || side === 'top')) return 'left:auto;right:16px;margin-left:0;';
  if (align === 'start' && (side === 'left' || side === 'right')) return 'top:16px;margin-top:0;';
  if (align === 'end' && (side === 'left' || side === 'right')) return 'top:auto;bottom:16px;margin-top:0;';
  return '';
}

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
    multipleSlots: true,
  },
  properties: {
    open: {
      type: Boolean,
      value: false,
    },
    /** '"top" | "right" | "bottom" | "left"' — Radix tooltip defaults top. */
    side: {
      type: String,
      value: 'top',
    },
    /** '"start" | "center" | "end"'. */
    align: {
      type: String,
      value: 'center',
    },
    /** Gap to the trigger in px (upstream 1); the arrow's height is added. */
    sideOffset: {
      type: null,
      optionalTypes: [Number, String],
      value: 1,
    },
    /** The hand-drawn arrow between the note and the trigger. */
    arrow: {
      type: Boolean,
      value: true,
    },
    // Paper props (TooltipContent forwards stock/tilt/seed to Paper).
    stock: {
      type: String,
      value: 'sticky-yellow',
    },
    edge: {
      type: null,
      optionalTypes: [String, Object],
      value: '',
    },
    tilt: {
      type: null,
      optionalTypes: [Boolean, Number, String],
      value: true,
    },
    seed: {
      type: null,
      optionalTypes: [String, Number],
      value: '',
    },
    ariaLabel: String,
    customStyle: String,
  },
  data: {
    visible: false,
    closing: false,
    placed: false,
    panelStyle: 'left:0;top:0;',
    arrowStyle: '',
    arrowUri: '',
  },
  observers: {
    // object-form observers (per-property string observers proved unreliable)
    open(open) {
      if (open) this.__show();
      else if (this.data.visible) this.__dismiss();
    },
  },
  lifetimes: {
    attached() {
      if (this.data.open) this.__show();
    },
    detached() {
      if (this.__placeTimer) clearTimeout(this.__placeTimer);
      if (this.__exitTimer) clearTimeout(this.__exitTimer);
    },
  },
  methods: {
    onTriggerLongPress() {
      if (this.data.closing) return;
      if (!this.data.open) {
        this.triggerEvent('change', { value: true });
        this.__show();
      }
    },
    onOutsideTap() {
      this.triggerEvent('close');
      this.triggerEvent('change', { value: false });
      if (!this.data.open) this.__dismiss();
    },
    noop() {},

    __show() {
      if (this.__exitTimer) {
        clearTimeout(this.__exitTimer);
        this.__exitTimer = null;
      }
      this.setData({ visible: true, closing: false, placed: false, panelStyle: 'left:0;top:0;' });
      // The note mounts invisible at (0,0); one measure hop reads the trigger
      // rect and the note's fit-content box, then places it (flip + clamp).
      this.__placeTimer = setTimeout(() => this.__place(), 60);
    },
    __dismiss() {
      if (!this.data.visible || this.data.closing) return;
      this.setData({ closing: true });
      this.__exitTimer = setTimeout(() => {
        this.__exitTimer = null;
        this.setData({ visible: false, closing: false, placed: false });
      }, 150);
    },

    __place() {
      const d = this.data;
      const off = (Number(d.sideOffset) || 0) + (d.arrow ? ARROW_H - 4 : 0);
      this.createSelectorQuery()
        .select('.ll-tooltip__trigger')
        .boundingClientRect()
        .select('.ll-tooltip__panel')
        .boundingClientRect()
        .exec((res) => {
          const rect = res && res[0];
          const note = res && res[1];
          if (!rect || !note) return;
          const info = wx.getSystemInfoSync();
          const vw = info.windowWidth || 375;
          const vh = info.windowHeight || 667;
          const w = note.width;
          const h = note.height;
          let side = d.side || 'top';
          // flip when the note would leave the viewport and the other side fits
          if ((side === 'bottom' && rect.bottom + off + h > vh - MARGIN && rect.top - off - h >= MARGIN) ||
              (side === 'top' && rect.top - off - h < MARGIN && rect.bottom + off + h <= vh - MARGIN)) {
            side = side === 'bottom' ? 'top' : 'bottom';
          } else if ((side === 'right' && rect.right + off + w > vw - MARGIN && rect.left - off - w >= MARGIN) ||
              (side === 'left' && rect.left - off - w < MARGIN && rect.right + off + w <= vw - MARGIN)) {
            side = side === 'right' ? 'left' : 'right';
          }
          const align = d.align || 'center';
          let left, top;
          if (side === 'bottom' || side === 'top') {
            left = align === 'start' ? rect.left : align === 'end' ? rect.right - w : rect.left + rect.width / 2 - w / 2;
            left = Math.max(MARGIN, Math.min(left, vw - MARGIN - w));
            top = side === 'bottom' ? rect.bottom + off : rect.top - off - h;
          } else {
            top = align === 'end' ? rect.bottom - h : align === 'start' ? rect.top : rect.top + rect.height / 2 - h / 2;
            top = Math.max(MARGIN, Math.min(top, vh - MARGIN - h));
            left = side === 'right' ? rect.right + off : rect.left - off - w;
          }
          const panelStyle = `left:${Math.round(left)}px;top:${Math.round(top)}px;`;
          let arrowStyle = '';
          let arrowUri = '';
          if (d.arrow) {
            arrowStyle = ARROW_AT[side] + arrowAlign(side, align);
            const r = pointerMark(`${d.seed || 'll-tooltip'}|pointer`, { w: 18, h: 16 });
            arrowUri = svgDataUri(r.svg, r);
          }
          this.setData({ placed: true, panelStyle, arrowStyle, arrowUri, side });
        });
    },
  },
});
