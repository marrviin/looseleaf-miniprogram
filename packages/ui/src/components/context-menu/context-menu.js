import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';

ensureHandFont();

/** ll-context-menu — upstream ContextMenu: a paper slip of menu rows that
    opens where you pressed. Radix opens it on right-click (or the menu
    key); a phone has neither, so it opens on a long-press of the trigger
    (the system 350ms) and the slip lands at the press point, clamped to
    the viewport. The rows are the shared ll-dropdown-menu-* family —
    upstream's context/dropdown/menubar share menu-styles.ts — and bubble
    `select` (close) / `change` (stay open) exactly the same. */
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
    /** Content min-width in px (examples pass w-52/w-56/w-72). */
    width: {
      type: null,
      optionalTypes: [Number, String],
      value: 128,
    },
    // Paper props (ContextMenuContent forwards these to Paper).
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
      if (open && !this.data.visible) this.__show();
      else if (!open && this.data.visible) this.__dismiss();
    },
    width() {
      if (this.data.visible && !this.data.closing) this.__place();
    },
  },
  lifetimes: {
    detached() {
      if (this.__placeTimer) clearTimeout(this.__placeTimer);
      if (this.__exitTimer) clearTimeout(this.__exitTimer);
    },
  },
  methods: {
    /** The long-press: remember where the finger is — Radix anchors the
        slip at the pointer (its top-left corner, adjusted to fit). */
    onTriggerLongPress(e) {
      if (this.data.closing) return;
      const t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || {};
      this.__point = { x: t.clientX || 0, y: t.clientY || 0 };
      this.triggerEvent('change', { value: true });
      this.__show();
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
      if (!this.__point) {
        // opened controlled without a press: center of the viewport
        const info = wx.getSystemInfoSync();
        this.__point = { x: (info.windowWidth || 375) / 2, y: (info.windowHeight || 667) / 2 };
      }
      this.setData({ visible: true, closing: false, placed: false });
      // Mount invisible, then two measure hops: place at the press point,
      // then re-anchor by the real panel height.
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
      const p = this.__point || { x: 0, y: 0 };
      const wpx = Number(d.width) || 128;
      const info = wx.getSystemInfoSync();
      const vw = info.windowWidth || 375;
      const vh = info.windowHeight || 667;
      // top-left at the press point; flip back inside when it would spill
      let left = p.x;
      if (left + wpx > vw - MARGIN) left = Math.max(MARGIN, p.x - wpx);
      left = Math.min(left, vw - MARGIN - wpx);
      let top = Math.min(p.y, vh - MARGIN - 60);
      const maxH = Math.max(60, vh - top - MARGIN);
      const panelStyle = `left:${left}px;top:${top}px;width:${wpx}px;`;
      const viewportStyle = `max-height:${Math.round(maxH)}px;`;
      this.setData({ placed: true, panelStyle, viewportStyle });
      this.__placeTimer = setTimeout(() => {
        this.createSelectorQuery()
          .select('.ll-context-menu__panel')
          .boundingClientRect()
          .select('.ll-context-menu__content')
          .boundingClientRect()
          .exec((res) => {
            const rect = res && res[0];
            const content = res && res[1];
            if (!rect) return;
            const patch = {};
            // re-anchor: if the slip spills past the bottom, raise its top
            if (rect.bottom > vh - MARGIN) {
              const t = Math.max(MARGIN, vh - MARGIN - rect.height);
              patch.panelStyle = `left:${left}px;top:${t}px;width:${wpx}px;`;
              const maxH2 = Math.max(60, t + rect.height <= vh - MARGIN ? vh - MARGIN * 2 : vh - top - MARGIN);
              patch.viewportStyle = `max-height:${Math.round(maxH2)}px;`;
            }
            // While the rows fit, the viewport doesn't clip: an
            // overflow:hidden/auto box would shear off a sub-menu's
            // absolutely-positioned flyout. Scroll only when needed.
            if (content) {
              const vs = patch.viewportStyle || this.data.viewportStyle;
              const maxNow = Number(vs.match(/max-height:(\d+)px/)[1]);
              const fits = content.height + 16 <= maxNow; // 16 = p-1 ×2
              const wanted = `${vs}${fits ? 'overflow:visible;' : ''}`;
              patch.viewportStyle = wanted;
            }
            if (Object.keys(patch).length) this.setData(patch);
          });
      }, 50);
    },
  },
});
