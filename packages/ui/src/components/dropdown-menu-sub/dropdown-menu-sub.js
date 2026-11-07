import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';

ensureHandFont();

/** ll-dropdown-menu-sub — upstream DropdownMenuSub: a nested menu set down
    beside its row (alignOffset -4, the slip's padding), flipped when the
    viewport clips. The trigger keeps the highlighter while open
    (data-[state=open]:ll-swipe). Rows inside bubble `select`/`change`
    through to the parent menu like any slotted row. */
const MARGIN = 8;

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    /** Radix Sub also takes `open`/`onOpenChange` — controlled support so
        an owner (or tests) can drive the sub-menu from outside. */
    open: {
      type: Boolean,
      value: false,
    },
    /** The row's text (a drawn icon can be asked for with `icon`). */
    label: {
      type: String,
      value: '',
    },
    icon: {
      type: String,
      value: '',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    /** Sub-content min-width in px (upstream min-w-32). */
    width: {
      type: null,
      optionalTypes: [Number, String],
      value: 128,
    },
    // Paper props (SubContent forwards these to Paper).
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
    customStyle: String,
  },
  data: {
    panelStyle: 'left:0;top:0;',
    placing: false,
    viewportStyle: '',
    liftShadow: '0 1px 1.5px rgba(58,44,30,0.2),0 7px 16px -4px rgba(58,44,30,0.2)',
  },
  observers: {
    // object-form observers (the per-property string observer form proved
    // unreliable here — the main menu's controlled `open` uses this form)
    open(v) {
      if (!this.__toggling && v) {
        this.setData({ panelStyle: 'left:0;top:0;', placing: true });
        setTimeout(() => this.__place(), 60);
      }
    },
    width() {
      if (this.data.open) this.__place();
    },
  },
  lifetimes: {
    detached() {
      if (this.__placeTimer) clearTimeout(this.__placeTimer);
    },
  },
  methods: {
    onTriggerTap() {
      if (this.data.disabled) return;
      const next = !this.data.open;
      this.__toggling = true;
      this.setData({ open: next, panelStyle: 'left:0;top:0;', placing: true });
      this.__toggling = false;
      this.triggerEvent('change', { value: next });
      if (next) setTimeout(() => this.__place(), 60);
    },
    noop() {},

    /** The panel is position:absolute against the sub's root; the trigger
        (first full-width child) shares the sub's origin, so the local
        position is simply desired-viewport − trigger-rect. No second
        measurement needed. */
    __place() {
      const d = this.data;
      const wpx = Number(d.width) || 128;
      this.createSelectorQuery()
        .select('.ll-menu-sub__trigger')
        .boundingClientRect()
        .exec((res) => {
          const rect = res && res[0];
          if (!rect) return;
          const info = wx.getSystemInfoSync();
          const vw = info.windowWidth || 375;
          const vh = info.windowHeight || 667;
          // alignOffset -4: the sub-slip overlaps its row by the padding.
          // Radix's collision handling: fly right when it fits, flip left
          // when THAT fits, otherwise keep the right placement and shift it
          // inside the viewport (never pushed to the far edge).
          const fitsRight = rect.right - 4 + wpx <= vw - MARGIN;
          const fitsLeft = rect.left - wpx + 4 >= MARGIN;
          let left;
          if (fitsRight) left = rect.right - 4;
          else if (fitsLeft) left = rect.left - wpx + 4;
          else if (vw - rect.right >= rect.left) left = Math.min(rect.right - 4, vw - MARGIN - wpx);
          else left = Math.max(MARGIN, rect.left - wpx + 4);
          const top = Math.max(MARGIN, Math.min(rect.top - 4, vh - MARGIN - 40));
          this.setData({
            placing: false,
            panelStyle: `left:${Math.round(left - rect.left)}px;top:${Math.round(top - rect.top)}px;width:${wpx}px;`,
            viewportStyle: `max-height:${Math.round(vh - MARGIN * 2)}px;`,
          });
        });
    },
  },
});
