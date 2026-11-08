import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';

ensureHandFont();

/** ll-menubar-menu — upstream MenubarMenu + Trigger + Content folded into
    one self-contained title: the written title on the bar (the highlighter
    while open) and its slip of rows beneath (align start, alignOffset -4,
    sideOffset 8, min-w-48). The rows are the shared ll-dropdown-menu-*
    family, bubbling `select` (close) / `change` (stay open). Radix switches
    menus on hover; on touch, tapping another title while one is open
    switches — the bar closes the rest. */
const MARGIN = 8;

/** data-[side]:[--ll-sheet-shadow:var(--ll-shadow-lift)] — flattened. */
const LIFT_SHADOW =
  '0 1px 1.5px rgba(58,44,30,0.2),0 7px 16px -4px rgba(58,44,30,0.2)';

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    /** The title written on the bar. */
    label: {
      type: String,
      value: '',
    },
    open: {
      type: Boolean,
      value: false,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    /** Content min-width in px (upstream min-w-48; examples pass w-48…w-56). */
    width: {
      type: null,
      optionalTypes: [Number, String],
      value: 192,
    },
    // Paper props (MenubarContent forwards these to Paper).
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
  relations: {
    '../menubar/menubar': {
      type: 'ancestor',
      linked(parent) {
        this.__bar = parent;
      },
      unlinked() {
        this.__bar = null;
      },
    },
  },
  lifetimes: {
    detached() {
      if (this.__placeTimer) clearTimeout(this.__placeTimer);
      if (this.__exitTimer) clearTimeout(this.__exitTimer);
    },
  },
  methods: {
    onTriggerTap() {
      if (this.data.disabled || this.data.closing) return;
      if (this.data.open) {
        this.__requestClose();
        return;
      }
      this.__open();
    },
    onOutsideTap() {
      this.triggerEvent('close');
      this.triggerEvent('change', { value: false, label: this.data.label });
      if (!this.data.open) this.__dismiss();
      else this.setData({ open: false }); // observer dismisses
    },
    /** A row's bubbled `select` — choice rows emit `change` instead and
        stay open, like upstream's onSelect preventDefault. */
    onItemSelect() {
      this.triggerEvent('close');
      this.triggerEvent('change', { value: false, label: this.data.label });
      if (!this.data.open) this.__dismiss();
      else this.setData({ open: false });
    },
    /** The bar closes the other menus when a new one opens. */
    dismissFromBar() {
      this.triggerEvent('change', { value: false, label: this.data.label });
      if (!this.data.open) this.__dismiss();
      else this.setData({ open: false });
    },
    noop() {},

    __open() {
      this.__toggling = true;
      this.setData({ open: true });
      this.__toggling = false;
      this.triggerEvent('change', { value: true, label: this.data.label });
      if (this.__bar) this.__bar.onMenuOpen(this);
      this.__show();
    },
    __requestClose() {
      this.triggerEvent('change', { value: false, label: this.data.label });
      if (!this.data.open) this.__dismiss();
      else this.setData({ open: false });
    },
    __show() {
      if (this.__exitTimer) {
        clearTimeout(this.__exitTimer);
        this.__exitTimer = null;
      }
      this.setData({ visible: true, closing: false, placed: false });
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
      const wpx = Number(d.width) || 192;
      const off = 8; // sideOffset
      this.createSelectorQuery()
        .select('.ll-menubar-menu__trigger')
        .boundingClientRect((rect) => {
          if (!rect) return;
          const info = wx.getSystemInfoSync();
          const vw = info.windowWidth || 375;
          const vh = info.windowHeight || 667;
          // alignOffset -4: the slip's text lines up with its title
          let left = rect.left - 4;
          left = Math.max(MARGIN, Math.min(left, vw - MARGIN - wpx));
          const top = rect.bottom + off;
          const maxH = Math.max(60, vh - top - MARGIN);
          const panelStyle = `left:${left}px;top:${top}px;width:${wpx}px;`;
          const viewportStyle = `max-height:${Math.round(maxH)}px;`;
          this.setData({ placed: true, panelStyle, viewportStyle });
          this.__placeTimer = setTimeout(() => {
            this.createSelectorQuery()
              .select('.ll-menubar-menu__panel')
              .boundingClientRect()
              .select('.ll-menubar-menu__content')
              .boundingClientRect()
              .exec((res) => {
                const p = res && res[0];
                const content = res && res[1];
                if (!p) return;
                const patch = {};
                // keep the slip on screen when the bar sits low
                if (p.height > maxH) {
                  patch.viewportStyle = `max-height:${Math.round(vh - top - MARGIN)}px;`;
                }
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
        })
        .exec();
    },
  },
});
