import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';

ensureHandFont();

/** Upstream PopoverContent shadow: data-[side]:[--ll-sheet-shadow:lift]. */
const LIFT_SHADOW =
  '0 1px 1.5px rgba(58,44,30,0.2),0 7px 16px -4px rgba(58,44,30,0.2)';

const MARGIN = 8;

/** ll-hover-card — upstream HoverCard: a paper photo slip anchored to its
    trigger (Radix popper simplified: clamp to the viewport, flip when
    clipped, no arrow). Touch adaptation: Radix opens on hover — WeChat has
    none, so the card opens on tap of the trigger (openDelay still applies)
    and closes on the next tap anywhere else (closeDelay). Controlled via
    `open`; the trigger tap emits `change`. */
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
    /** ms the trigger waits before opening (upstream 700 — a hover guard;
        on touch there is no pointer pass to damp, so the default is 0). */
    openDelay: {
      type: null,
      optionalTypes: [Number, String],
      value: 0,
    },
    /** ms the card lingers before closing (upstream 300). */
    closeDelay: {
      type: null,
      optionalTypes: [Number, String],
      value: 0,
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
    /** Gap to the trigger in px. */
    sideOffset: {
      type: null,
      optionalTypes: [Number, String],
      value: 8,
    },
    /** Content width in px (upstream w-64; examples pass w-72/w-56). */
    width: {
      type: null,
      optionalTypes: [Number, String],
      value: 256,
    },
    // Paper props (HoverCardContent forwards these to Paper).
    stock: {
      type: String,
      value: 'photo',
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
    liftShadow: LIFT_SHADOW,
  },
  observers: {
    open(open) {
      if (open) this.__show();
      else if (this.data.visible) this.__dismiss();
    },
    'side, align, sideOffset, width'() {
      if (this.data.visible && !this.data.closing) this.__place();
    },
  },
  lifetimes: {
    attached() {
      if (this.data.open) this.__show();
    },
    detached() {
      if (this.__openTimer) clearTimeout(this.__openTimer);
      if (this.__closeTimer) clearTimeout(this.__closeTimer);
      if (this.__placeTimer) clearTimeout(this.__placeTimer);
      if (this.__exitTimer) clearTimeout(this.__exitTimer);
    },
  },
  methods: {
    onTriggerTap() {
      if (this.data.closing) return;
      if (this.data.open || this.data.visible) {
        this.__closeWithDelay();
        return;
      }
      const delay = Number(this.data.openDelay) || 0;
      if (this.__openTimer) clearTimeout(this.__openTimer);
      this.__openTimer = setTimeout(() => {
        this.__openTimer = null;
        this.triggerEvent('change', { value: true });
        this.__show();
      }, delay);
    },
    /** Long-press also opens: the trigger usually holds an ll-button, whose
        catchtap swallows the tap before it bubbles to the wrapper — the
        longpress event still reaches us (WeChat suppresses the inner tap
        after a long-press, so the button doesn't also fire). */
    onTriggerLongPress() {
      if (this.data.closing || this.data.open || this.data.visible) return;
      this.triggerEvent('change', { value: true });
      this.__show();
    },
    onOutsideTap() {
      this.__closeWithDelay();
    },
    __closeWithDelay() {
      this.triggerEvent('close');
      this.triggerEvent('change', { value: false });
      if (!this.data.open) {
        const delay = Number(this.data.closeDelay) || 0;
        if (this.__closeTimer) clearTimeout(this.__closeTimer);
        this.__closeTimer = setTimeout(() => {
          this.__closeTimer = null;
          this.__dismiss();
        }, delay);
      }
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
      const wpx = Number(d.width) || 256;
      const off = Number(d.sideOffset) || 8;
      this.createSelectorQuery()
        .select('.ll-hover-card__trigger')
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
            // left/right cards start level with their link (upstream: none
            // rises above the page)
            top = align === 'end' ? rect.bottom - 40 : align === 'start' ? rect.top : rect.top + rect.height / 2 - 20;
            left = side === 'right' ? rect.right + off : rect.left - off - wpx;
            left = Math.max(MARGIN, Math.min(left, vw - MARGIN - wpx));
          }
          const panelStyle = `left:${left}px;top:${top}px;width:${wpx}px;`;
          this.setData({ placed: true, panelStyle, side });
          this.__placeTimer = setTimeout(() => {
            this.createSelectorQuery()
              .select('.ll-hover-card__panel')
              .boundingClientRect((p) => {
                if (!p) return;
                // Re-anchor with the real height, then keep it on screen —
                // the card is position:fixed, so a clipped card could never
                // be scrolled into view the way upstream's can.
                let top;
                if (side === 'top') {
                  top = rect.top - off - p.height;
                } else if (side === 'bottom') {
                  top = rect.bottom + off;
                  if (top + p.height > vh - MARGIN && rect.top - off - p.height >= MARGIN) {
                    top = rect.top - off - p.height; // flip up now that we know the height
                  }
                } else {
                  top = align === 'end' ? rect.bottom - p.height : align === 'start' ? rect.top : rect.top + rect.height / 2 - p.height / 2;
                }
                top = Math.max(MARGIN, Math.min(top, vh - MARGIN - p.height));
                const style = this.data.panelStyle.replace(/top:-?[\d.]+px/, `top:${top}px`);
                if (style !== this.data.panelStyle) this.setData({ panelStyle: style });
              })
              .exec();
          }, 50);
        })
        .exec();
    },
  },
});
