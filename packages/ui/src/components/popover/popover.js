import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { svgDataUri } from '../../common/ink';
import { pointerMark } from '../../common/ink-engine';

ensureHandFont();

/** Upstream PopoverContent: w-72 (288px) p-4, slip stock, shadow-lift on
    every side, zoom+slide pop in 0.18s (--ll-dur-pop). Radix adds the
    arrow's height to sideOffset; the pointerMark svg (22x20 + 3pad) fills
    the gap. Collision: clamp to 8px margins, flip side when clipped
    (simplified Radix popper — the second measure pass corrects top for the
    real panel height). */
const MARGIN = 8;
const ARROW_H = 26; // svg box height (res.h + pad*2)
/** data-[side]:[--ll-sheet-shadow:var(--ll-shadow-lift)] — flattened. */
const LIFT_SHADOW =
  '0 1px 1.5px rgba(58,44,30,0.2),0 7px 16px -4px rgba(58,44,30,0.2)';

/** Arrow placement per computed side — the drawn pointer faces DOWN, so
    the box rotates (Radix's --radix-popover-arrow-transform). */
const ARROW_AT = {
  bottom: 'top:-22px;left:50%;margin-left:-14px;transform:rotate(180deg);',
  top: 'bottom:-22px;left:50%;margin-left:-14px;',
  right: 'left:-24px;top:50%;margin-top:-14px;transform:rotate(90deg);',
  left: 'right:-24px;top:50%;margin-top:-14px;transform:rotate(-90deg);',
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
    /** '"top" | "right" | "bottom" | "left"' — flipped when the viewport clips. */
    side: {
      type: String,
      value: 'bottom',
    },
    /** '"start" | "center" | "end"'. */
    align: {
      type: String,
      value: 'center',
    },
    /** Gap to the trigger in px; the arrow's height is added automatically. */
    sideOffset: {
      type: null,
      optionalTypes: [Number, String],
      value: 8,
    },
    arrow: {
      type: Boolean,
      value: false,
    },
    /** Content width in px (upstream passes className w-72/w-80/w-56/w-60). */
    width: {
      type: null,
      optionalTypes: [Number, String],
      value: 288,
    },
    /** The slip's padding (upstream PopoverContent classes p-4 / p-0 when
        the content brings its own paper). */
    padding: {
      type: String,
      value: '32rpx',
    },
    // Paper props (PopoverContent forwards these to Paper).
    stock: {
      type: String,
      value: 'slip',
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
    tape: {
      type: null,
      optionalTypes: [String, Boolean],
      value: false,
    },
    /** false | true (steel) | an accent color name (sky, grape...). */
    pin: {
      type: null,
      optionalTypes: [String, Boolean],
      value: false,
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
    panelStyle: '',
    arrowStyle: '',
    arrowUri: '',
    liftShadow: LIFT_SHADOW,
  },
  observers: {
    open(open) {
      if (open) this.__show();
      else if (this.data.visible) this.__dismiss();
    },
    'side, align, sideOffset, arrow, width'() {
      if (this.data.visible && !this.data.closing) this.__place();
    },
  },
  lifetimes: {
    attached() {
      if (this.data.open) this.__show();
    },
    detached() {
      if (this.__placeTimer) clearTimeout(this.__placeTimer);
      if (this.__exitTimer) clearTimeout(this.__exitTimer);
      if (this.__settleTimer) clearTimeout(this.__settleTimer);
    },
  },
  methods: {
    onTriggerTap() {
      if (this.data.closing) return;
      if (!this.data.open) {
        this.triggerEvent('change', { value: true });
        this.__show();
      }
    },
    /** Long-press also opens: the trigger usually holds an ll-button, whose
        catchtap swallows the tap before it bubbles to the wrapper — the
        longpress event still reaches us (WeChat suppresses the inner tap
        after a long-press, so the button doesn't also fire). */
    onTriggerLongPress() {
      if (this.data.closing || this.data.open) return;
      this.triggerEvent('change', { value: true });
      this.__show();
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
      this.setData({ visible: true, closing: false, placed: false });
      // The panel mounts invisible, then two measure hops place it: trigger
      // rect first, panel height second (flip/clamp like Radix's popper).
      setTimeout(() => this.__place(), 60);
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
      const wpx = Number(d.width) || 288;
      const off = (Number(d.sideOffset) || 8) + (d.arrow ? ARROW_H - 4 : 0);
      this.createSelectorQuery()
        .select('.ll-popover__trigger')
        .boundingClientRect((rect) => {
          if (!rect) return;
          const info = wx.getSystemInfoSync();
          const vw = info.windowWidth || 375;
          const vh = info.windowHeight || 667;
          let side = d.side || 'bottom';
          // flip when the panel would clip (collisionPadding 8)
          if ((side === 'bottom' && rect.bottom + off + 120 > vh - MARGIN) ||
              (side === 'top' && rect.top - off - 120 < MARGIN)) {
            side = side === 'bottom' ? 'top' : 'bottom';
          }
          if ((side === 'right' && rect.right + off + 120 > vw - MARGIN) ||
              (side === 'left' && rect.left - off - 120 < MARGIN)) {
            side = side === 'right' ? 'left' : 'right';
          }
          const align = d.align || 'center';
          let left, top;
          if (side === 'bottom' || side === 'top') {
            left = align === 'start' ? rect.left : align === 'end' ? rect.right - wpx : rect.left + rect.width / 2 - wpx / 2;
            left = Math.max(MARGIN, Math.min(left, vw - MARGIN - wpx));
            top = side === 'bottom' ? rect.bottom + off : rect.top - off;
          } else {
            top = align === 'end' ? rect.bottom - 40 : align === 'start' ? rect.top : rect.top + rect.height / 2 - 20;
            left = side === 'right' ? rect.right + off : rect.left - off - wpx;
            left = Math.max(MARGIN, Math.min(left, vw - MARGIN - wpx));
          }
          const panelStyle = `left:${left}px;top:${top}px;width:${wpx}px;`;
          let arrowStyle = '';
          let arrowUri = this.data.arrowUri;
          if (d.arrow) {
            arrowStyle = ARROW_AT[side] + arrowAlign(side, align);
            const res = pointerMark(`${d.seed || 'll-popover'}|pointer`, {});
            arrowUri = svgDataUri(res.svg, res);
          }
          // Only write `side` when it flipped: the side/align/... observer
          // re-places, and a same-value write would loop this forever (each
          // pass overwriting the last pass's height correction).
          const patch = { placed: true, panelStyle, arrowStyle, arrowUri };
          if (side !== d.side) patch.side = side;
          this.setData(patch);
          this.__placeTimer = setTimeout(() => {
            this.createSelectorQuery()
              .select('.ll-popover__panel')
              .boundingClientRect((p) => {
                if (!p) return;
                let style = this.data.panelStyle;
                if (side === 'top') {
                  const t = rect.top - off - p.height;
                  style = style.replace(/top:-?[\d.]+px/, `top:${t}px`);
                } else if (side === 'left' || side === 'right') {
                  const t = align === 'end' ? rect.bottom - p.height : align === 'start' ? rect.top : rect.top + rect.height / 2 - p.height / 2;
                  style = style.replace(/top:-?[\d.]+px/, `top:${t}px`);
                }
                if (style !== this.data.panelStyle) this.setData({ panelStyle: style });
              })
              .exec();
          }, 50);
        })
        .exec();
    },
  },
});
