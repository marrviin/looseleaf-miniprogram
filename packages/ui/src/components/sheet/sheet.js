import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';

ensureHandFont();

/** --ll-dur-sheet (0.3s): slide/fade duration; the exit animation runs this
    long before the wx:if clears. */
const EXIT_MS = 300;

function isPhone() {
  try {
    return (wx.getSystemInfoSync().windowWidth || 375) < 640;
  } catch (e) {
    return true;
  }
}

/** The edge of the paper that faces the middle of the screen. */
const INNER = { right: 'left', left: 'right', top: 'bottom', bottom: 'top' };

/** Upstream data-[side=…]:[--ll-sheet-shadow:…] overrides — the shadow is
    cast toward the page underneath. rgba precomputed from --ll-shade. */
const SIDE_SHADOWS = {
  right: '-7px 0 18px -6px rgba(58,44,30,0.34), -1px 0 1.5px rgba(58,44,30,0.24)',
  left: '7px 0 18px -6px rgba(58,44,30,0.34), 1px 0 1.5px rgba(58,44,30,0.24)',
  top: '0 7px 18px -6px rgba(58,44,30,0.34), 0 1px 1.5px rgba(58,44,30,0.24)',
  bottom: '0 -7px 18px -6px rgba(58,44,30,0.34), 0 -1px 1.5px rgba(58,44,30,0.24)',
};

/** Upstream xClass: the x steps clear of the coils when they run along its
    corner (end-9 = 36px from the end; top-9 = 36px; end/top-3 = 12px). */
function xPlace(bound, edge) {
  if (bound && edge === 'right') return { end: 36, top: 12 };
  if (bound && edge === 'top') return { end: 12, top: 36 };
  return { end: 12, top: 12 };
}

/** ll-sheet — upstream Sheet: a notebook page that slides in from an edge,
    bound along the edge facing the middle (spiral coils, binder holes, a
    perf tear line, torn from a pad, or plain cut). `open` is controlled:
    the page sets it and listens for `change`/`close`. */
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
    /** '"top" | "right" | "bottom" | "left"' — the edge it slides in from. */
    side: {
      type: String,
      value: 'right',
    },
    /** '"spiral" | "holes" | "perf" | "torn" | "none"'. */
    binding: {
      type: String,
      value: 'spiral',
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
    // Paper props forwarded to the page.
    stock: {
      type: String,
      value: 'paper',
    },
    rules: {
      type: String,
      value: '',
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
    llInkSelector: '.ll-sheet__x',
    visible: false,
    closing: false,
    innerEdge: 'left',
    bound: true,
    paperEdge: '',
    paperStyle: '',
    xStyle: '',
    shadowCss: '',
  },
  observers: {
    open(open) {
      if (open) this.__show();
      else if (this.data.visible) this.__dismiss();
    },
    'side, binding'() {
      if (this.data.visible) this.__show();
    },
  },
  lifetimes: {
    attached() {
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
      const side = d.side || 'right';
      const edge = INNER[side] || 'left';
      const bound = d.binding === 'spiral' || d.binding === 'holes';
      // perf/torn finish the inner edge as a drawn Paper edge instead of a strip.
      const paperEdge = d.binding === 'perf' || d.binding === 'torn' ? { [edge]: d.binding } : null;

      // The wrapper (wxss) carries the per-side fixed position; the paper
      // fills it as a flex column with gap-4. Safe-area foot on
      // right/left/bottom; bound sheets pad along the binding edge (pl-6…).
      let fill = 'display:flex;flex-direction:column;gap:32rpx;box-sizing:border-box;';
      if (side === 'right' || side === 'left') fill += 'height:100%;';
      if (side !== 'top') fill += 'padding-bottom:env(safe-area-inset-bottom);';
      if (bound && edge === 'left') fill += 'padding-left:48rpx;'; // pl-6
      if (bound && edge === 'right') fill += 'padding-right:48rpx;';
      if (bound && edge === 'top') fill += 'padding-top:48rpx;';
      if (bound && edge === 'bottom' && side === 'top') fill += 'padding-bottom:48rpx;';

      const x = xPlace(bound, edge);
      const xStyle = `top:${x.top * 2}rpx;right:${x.end * 2}rpx;`;

      this.setData({
        visible: true,
        closing: false,
        innerEdge: edge,
        bound,
        paperEdge,
        paperStyle: `${fill}${d.customStyle || ''}`,
        xStyle,
        shadowCss: SIDE_SHADOWS[side] || '',
      });
      // The strip and x mount with the page — (re)draw their ink.
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
      if (!this.data.open) this.__dismiss();
    },
    onOverlayTap() {
      if (this.data.closable) this.__requestClose();
    },
    onCloseTap() {
      this.__requestClose();
    },
    onXTouchStart() {
      this.setData({ hovered: true });
    },
    onXTouchEnd() {
      this.setData({ hovered: false });
    },
    noop() {},
  },
});
