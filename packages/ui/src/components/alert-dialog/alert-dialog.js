import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';

ensureHandFont();

/** --ll-dur-sheet (0.3s): how long the exit animation runs before the
    portal unmounts. Enters animate on mount; exits swap to the closing
    class, then the wx:if clears. */
const EXIT_MS = 300;

function isPhone() {
  try {
    return (wx.getSystemInfoSync().windowWidth || 375) < 640;
  } catch {
    return true;
  }
}

/** ll-alert-dialog — upstream AlertDialog on a Paper sheet. Like ll-dialog
    but Radix's alert semantics: no close button, the dim tap does NOT
    dismiss (closable=false default), and the answers close it themselves —
    ll-alert-dialog-action/cancel emit bubbling `alert-action`/`alert-cancel`
    events this root catches on its sheet. `tone="danger"` tapes red-and-white
    hazard strips across the top corners (they hide on phones, upstream
    max-sm); `size="sm"` is the narrow centered sheet. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    open: {
      type: Boolean,
      value: false,
    },
    /** '"default" | "sm"'. */
    size: {
      type: String,
      value: 'default',
    },
    /** '"default" | "danger"'. */
    tone: {
      type: String,
      value: 'default',
    },
    /** Close when the dim is tapped — Radix alert dialogs refuse, so the
        default here is false (upstream onPointerDownOutside is undefined). */
    closable: {
      type: Boolean,
      value: false,
    },
    // Paper props, forwarded to the sheet.
    stock: {
      type: String,
      value: 'paper',
    },
    edge: {
      type: null,
    },
    tilt: {
      type: null,
    },
    shadow: {
      type: String,
      value: 'stock',
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
    phone: true,
    paperTilt: true,
    paperStyle: '',
  },
  observers: {
    open(open) {
      if (open) this.__show();
      else if (this.data.visible) this.__dismiss();
    },
  },
  lifetimes: {
    attached() {
      this.setData({ phone: isPhone() });
      if (this.data.open) this.__show();
    },
  },
  methods: {
    __show() {
      if (this.__exitTimer) {
        clearTimeout(this.__exitTimer);
        this.__exitTimer = null;
      }
      const d = this.data;
      const phone = d.phone;
      // max-sm: the sheet lays flat and the hazard tape strips hide.
      const paperTilt = phone ? 0 : d.tilt;
      // Upstream puts p-6, gap-4, max-w-lg on the Paper element itself; the
      // phone pads its foot by the safe area (max-sm:[--ll-tilt:0deg]).
      const padBottom = phone ? 'max(48rpx, env(safe-area-inset-bottom))' : '48rpx';
      const paperStyle =
        `display:grid;gap:32rpx;` +
        `padding:48rpx;padding-bottom:${padBottom};${d.customStyle || ''}`;
      this.setData({ visible: true, closing: false, paperTilt, paperStyle });
    },
    __dismiss() {
      if (!this.data.visible || this.data.closing) return;
      this.setData({ closing: true });
      this.__exitTimer = setTimeout(() => {
        this.__exitTimer = null;
        this.setData({ visible: false, closing: false });
      }, EXIT_MS);
    },
    __requestClose() {
      this.triggerEvent('close');
      this.triggerEvent('change', { value: false });
      // Bound pages flip `open` and the observer plays the exit animation;
      // uncontrolled usage dismisses right here.
      if (!this.data.open) this.__dismiss();
    },
    onOverlayTap() {
      if (this.data.closable) this.__requestClose();
    },
    /** Bubbled from ll-alert-dialog-action inside the slot. Closes unless the
        action asked to stay open (upstream's onClick preventDefault — the
        async confirmation keeps the sheet up while it works). */
    onAction(ev) {
      if (ev && ev.detail && ev.detail.keepOpen) {
        this.triggerEvent('action');
        return;
      }
      this.triggerEvent('action');
      this.__requestClose();
    },
    /** Bubbled from ll-alert-dialog-cancel inside the slot. Always closes. */
    onCancel() {
      this.triggerEvent('cancel');
      this.__requestClose();
    },
    noop() {},
  },
});
