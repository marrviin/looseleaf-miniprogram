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

/** ll-dialog — upstream Dialog on a Paper sheet. `open` is controlled: the
    page sets it and listens for `change`/`close`. On phones (<640px, i.e.
    upstream's max-sm) the sheet is flat, untaped, full-width and slides in
    from the bottom; from sm it drops onto the dimmed page with its tilt. */
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
    showCloseButton: {
      type: Boolean,
      value: true,
    },
    /** Close when the dim is tapped (Radix modal default). */
    closable: {
      type: Boolean,
      value: true,
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
    tape: {
      type: null,
    },
    tapeKind: {
      type: String,
      value: 'masking',
    },
    fastener: {
      type: null,
    },
    fastenerTone: {
      type: String,
      value: '',
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
    // The corner x draws via the overlay closeMark recipe (fixed 32x32 box).
    llInkRecipe: 'close-mark',
    llInkSelector: '.ll-dialog__x',
    visible: false,
    closing: false,
    phone: true,
    paperTilt: true,
    paperTape: false,
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
      // max-sm: the sheet lays flat and tape strips hide.
      const paperTilt = phone ? 0 : d.tilt;
      const paperTape = phone ? false : d.tape;
      // Upstream puts p-6, gap-4, max-w-lg on the Paper element itself; the
      // phone pads its foot by the safe area. (Our x mark anchors to the
      // paper box, so the padding lives there like upstream's className.)
      const padBottom = phone ? 'max(48rpx, env(safe-area-inset-bottom))' : '48rpx';
      const paperStyle =
        `display:flex;flex-direction:column;gap:32rpx;` +
        `padding:48rpx;padding-bottom:${padBottom};${d.customStyle || ''}`;
      this.setData({ visible: true, closing: false, paperTilt, paperTape, paperStyle });
      // The close mark mounts with the portal — (re)draw its ink.
      setTimeout(() => this.__measureInk(), 60);
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
    onCloseTap() {
      this.__requestClose();
    },
    /** The x's hover blot (mouse-only upstream) shows while touched. */
    onXTouchStart() {
      this.setData({ hovered: true });
    },
    onXTouchEnd() {
      this.setData({ hovered: false });
    },
    noop() {},
  },
});
