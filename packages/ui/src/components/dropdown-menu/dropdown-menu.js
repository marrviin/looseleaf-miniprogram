import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';

ensureHandFont();

/** Upstream DropdownMenuContent (menu-styles.ts SLIP): z --ll-z-popover,
    min-w-32 (128px), p-0, slip stock, shadow-lift, fade+zoom-95 pop in
    --ll-dur-pop (0.18s) with a slide-from-side-2 (8px). Rows scroll in a
    viewport (p-1) inside the slip, never the slip itself, so its shadow and
    tape are not cut — the viewport's max-height is the Radix available
    height, computed here when placing. Radix's collision handling is
    simplified: pick the side with room, clamp to 8px margins. Items close
    the menu by bubbling a `select` event (checked/choice rows emit `change`
    instead and stay open, like upstream's onSelect preventDefault). */
const MARGIN = 8;

/** data-[side]:[--ll-sheet-shadow:var(--ll-shadow-lift)] — flattened. */
const LIFT_SHADOW =
  '0 1px 1.5px rgba(58,44,30,0.2),0 7px 16px -4px rgba(58,44,30,0.2)';

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
    /** '"top" | "right" | "bottom" | "left"' — flipped when clipped. */
    side: {
      type: String,
      value: 'bottom',
    },
    /** '"start" | "center" | "end"' — dropdowns default to start (Radix). */
    align: {
      type: String,
      value: 'start',
    },
    /** Gap to the trigger in px (Radix DropdownMenuContent default 6). */
    sideOffset: {
      type: null,
      optionalTypes: [Number, String],
      value: 6,
    },
    /** Content min-width in px (upstream min-w-32; examples pass w-40…w-60). */
    width: {
      type: null,
      optionalTypes: [Number, String],
      value: 128,
    },
    // Paper props (DropdownMenuContent forwards these to Paper).
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
    viewportStyle: '',
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
      if (this.__placeTimer) clearTimeout(this.__placeTimer);
      if (this.__exitTimer) clearTimeout(this.__exitTimer);
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
    onOutsideTap() {
      this.triggerEvent('close');
      this.triggerEvent('change', { value: false });
      if (!this.data.open) this.__dismiss();
    },
    /** A row's bubbled `select` — Radix closes the menu unless the item
        prevented it; choice rows emit `change` instead, so they never land
        here. */
    onItemSelect() {
      this.triggerEvent('close');
      this.triggerEvent('change', { value: false });
      this.__dismiss();
    },
    noop() {},

    __show() {
      if (this.__exitTimer) {
        clearTimeout(this.__exitTimer);
        this.__exitTimer = null;
      }
      this.setData({ visible: true, closing: false, placed: false });
      // Mount invisible, then two measure hops: trigger rect, panel height.
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
      const wpx = Number(d.width) || 128;
      const off = Number(d.sideOffset) || 0;
      this.createSelectorQuery()
        .select('.ll-dropdown-menu__trigger')
        .boundingClientRect((rect) => {
          if (!rect) return;
          const info = wx.getSystemInfoSync();
          const vw = info.windowWidth || 375;
          const vh = info.windowHeight || 667;
          let side = d.side || 'bottom';
          const align = d.align || 'start';
          const spaceBelow = vh - rect.bottom - off - MARGIN;
          const spaceAbove = rect.top - off - MARGIN;
          // flip when the requested side has no room and the other has more
          if (side === 'bottom' && spaceBelow < 60 && spaceAbove > spaceBelow) side = 'top';
          else if (side === 'top' && spaceAbove < 60 && spaceBelow > spaceAbove) side = 'bottom';
          if ((side === 'right' && rect.right + off + 120 > vw - MARGIN) ||
              (side === 'left' && rect.left - off - 120 < MARGIN)) {
            side = side === 'right' ? 'left' : 'right';
          }
          let left, top, maxH;
          if (side === 'bottom' || side === 'top') {
            left = align === 'center' ? rect.left + rect.width / 2 - wpx / 2 : align === 'end' ? rect.right - wpx : rect.left;
            left = Math.max(MARGIN, Math.min(left, vw - MARGIN - wpx));
            top = side === 'bottom' ? rect.bottom + off : rect.top - off;
            maxH = Math.max(60, side === 'bottom' ? spaceBelow : spaceAbove);
          } else {
            top = align === 'end' ? rect.bottom - 40 : align === 'start' ? rect.top : rect.top + rect.height / 2 - 20;
            left = side === 'right' ? rect.right + off : rect.left - off - wpx;
            left = Math.max(MARGIN, Math.min(left, vw - MARGIN - wpx));
            maxH = Math.max(60, vh - MARGIN * 2);
          }
          const panelStyle = `left:${left}px;top:${top}px;width:${wpx}px;`;
          // the viewport scrolls when rows overflow; the slip (shadow, tape)
          // is never cut
          const viewportStyle = `max-height:${Math.round(maxH)}px;`;
          this.setData({ placed: true, panelStyle, viewportStyle, side });
          this.__placeTimer = setTimeout(() => {
            this.createSelectorQuery()
              .select('.ll-dropdown-menu__panel')
              .boundingClientRect()
              .select('.ll-dropdown-menu__content')
              .boundingClientRect()
              .exec((res) => {
                const p = res && res[0];
                const content = res && res[1];
                if (!p) return;
                let style = this.data.panelStyle;
                if (side === 'top') {
                  const t = rect.top - off - p.height;
                  style = style.replace(/top:-?[\d.]+px/, `top:${t}px`);
                } else if (side === 'left' || side === 'right') {
                  const t = align === 'end' ? rect.bottom - p.height : align === 'start' ? rect.top : rect.top + rect.height / 2 - p.height / 2;
                  style = style.replace(/top:-?[\d.]+px/, `top:${t}px`);
                }
                const patch = {};
                if (style !== this.data.panelStyle) patch.panelStyle = style;
                // While the rows fit, the viewport doesn't clip: an
                // overflow:hidden/auto box would shear off a sub-menu's
                // absolutely-positioned flyout. Scroll only when needed.
                if (content) {
                  const vs = this.data.viewportStyle;
                  const fits = content.height + 16 <= Math.round(maxH); // 16 = p-1 ×2
                  const wanted = `max-height:${Math.round(maxH)}px;${fits ? 'overflow:visible;' : ''}`;
                  if (vs !== wanted) patch.viewportStyle = wanted;
                }
                if (Object.keys(patch).length) this.setData(patch);
              });
          }, 50);
        })
        .exec();
    },
  },
});
