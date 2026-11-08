import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';

ensureHandFont();

/** --ll-dur-sheet (0.3s): exit animation before the portal unmounts, and the
    settle time when a drag snaps back to a point. */
const EXIT_MS = 300;
/** vaul's flick velocity (~500 px/s). */
const FLICK_V = 0.5; // px/ms

function sys() {
  try {
    return wx.getSystemInfoSync();
  } catch (e) {
    return {};
  }
}

/** ll-drawer — upstream Drawer (vaul): a slip of paper pulled in from an
    edge, built on ll-paper. From the bottom it is torn off a pad and held
    down by a strip of tape as the grab tab. The drag is implemented here
    with touch events + an inline transform (vaul's translate): the dim's
    opacity follows the drag, a release past 25% of the edge (or a flick)
    puts the slip away, and `snapPoints` give the slip resting heights —
    the sheet's height IS the snap (vaul sizes the drawer to the snap and
    clips the overflow), the translate only carries the drag. */
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
    /** '"top" | "right" | "bottom" | "left"'. */
    direction: {
      type: String,
      value: 'bottom',
    },
    /** Resting heights as fractions of the window (vaul snapPoints, e.g.
        [0.35, 0.7, 1]); the drag snaps to the nearest. */
    snapPoints: {
      type: Array,
      value: null,
    },
    /** Snap index the dim reaches full opacity at (vaul fadeFromIndex). */
    fadeFromIndex: {
      type: null,
      optionalTypes: [Number, String],
      value: 0,
    },
    /** Whether the slip can be put away at all (vaul dismissible). */
    dismissible: {
      type: Boolean,
      value: true,
    },
    /** Close when the dim is tapped. */
    closable: {
      type: Boolean,
      value: true,
    },
    // Paper props.
    stock: {
      type: String,
      value: 'slip',
    },
    edge: {
      type: null,
    },
    /** '"kraft" | "masking" | "clear" | washi…' — the grab tab's tape
        (bottom drawers only). */
    tapeKind: {
      type: String,
      value: 'kraft',
    },
    tapeColor: {
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
    visible: false,
    closing: false,
    dragging: false,
    paperEdge: '',
    tapeVisible: false,
    // inline geometry: the page transform, the dim opacity
    pageStyle: '',
    dimStyle: '',
  },
  observers: {
    open(open) {
      if (open) this.__show();
      else if (this.data.visible) this.__dismiss();
    },
  },
  lifetimes: {
    attached() {
      const s = sys();
      this.__winH = s.windowHeight || 667;
      this.__winW = s.windowWidth || 375;
      this.__snapIndex = 0;
      if (this.data.open) this.__show();
    },
    detached() {
      if (this.__exitTimer) clearTimeout(this.__exitTimer);
    },
  },
  methods: {
    __show() {
      if (this.__exitTimer) {
        clearTimeout(this.__exitTimer);
        this.__exitTimer = null;
      }
      const d = this.data;
      const dir = d.direction;
      // Upstream DrawerContent: bottom defaults to a torn top edge (it is
      // torn off the pad), the other sides are plain cut slips.
      let paperEdge = d.edge;
      if (!paperEdge) paperEdge = dir === 'bottom' ? { top: 'torn' } : 'cut';
      const tapeVisible = dir === 'bottom';
      this.__snapIndex = 0;
      this.__applySnap(0, false);
      this.setData({ visible: true, closing: false, dragging: false, paperEdge, tapeVisible });
    },
    /** Snap drawers: the sheet is a FIXED-size slip (the largest snap, so
        the ll-paper's drawn face is measured once) parked low and revealed
        by its translate — vaul sizes the drawer to the snap; here the same
        visual comes from parking a taller sheet further down, its foot off
        screen. Returns { size, maxPx, t } for the resting geometry. */
    __snapGeom() {
      const snaps = this.data.snapPoints;
      const vertical = this.data.direction === 'bottom' || this.data.direction === 'top';
      const win = vertical ? this.__winH : this.__winW;
      const clampS = (v) => Math.min(Math.max(Number(v) || 0, 0.05), 1);
      const sizeProp = vertical ? 'height' : 'width';
      if (!snaps || !snaps.length) return null;
      const maxPx = Math.round(clampS(Math.max.apply(null, snaps.map(clampS))) * win);
      const size = `${sizeProp}:${maxPx}px;`;
      const tAt = (i) => Math.round(maxPx - clampS(snaps[i]) * win);
      return { size, maxPx, tAt, axis: vertical ? 'Y' : 'X', win };
    },
    /** Resting geometry for snap index i. */
    __applySnap(i, animate) {
      const g = this.__snapGeom();
      if (!g) {
        this.setData({
          pageStyle: `transform:translateY(0);transition:transform ${EXIT_MS}ms ease-out;`,
          dimStyle: 'opacity:1;',
        });
        return;
      }
      const t = g.tAt(i);
      const trans = animate ? `transition:transform ${EXIT_MS}ms ease-out;` : 'transition:none;';
      this.setData({
        pageStyle: `transform:translate${g.axis}(${t}px);${g.size}${trans}`,
        dimStyle: this.__dimAtT(t, g),
      });
      this.__snapIndex = i;
    },
    /** Dim opacity at translate t — the slip's revealed fraction over the
        fadeFromIndex snap's fraction (vaul: full at fadeFromIndex). */
    __dimAtT(t, g) {
      const d = this.data;
      let k = 1;
      if (d.snapPoints && d.snapPoints.length) {
        const fadeSnap = Math.min(Math.max(Number(d.fadeFromIndex) || 0, 0), d.snapPoints.length - 1);
        const fades = Math.min(Math.max(Number(d.snapPoints[fadeSnap]) || 1, 0.05), 1);
        const revealed = (g.maxPx - t) / g.win;
        k = Math.min(Math.max(revealed / fades, 0), 1);
      }
      return `opacity:${k.toFixed(3)};`;
    },
    __dismiss() {
      if (!this.data.visible || this.data.closing) return;
      this.setData({ closing: true, dragging: false });
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
      if (this.data.closable && this.data.dismissible) this.__requestClose();
    },
    /** Bubbled from ll-drawer-close inside the slot. Always closes. */
    onCloseRequest() {
      this.__requestClose();
    },

    // ---- the drag (vaul's translate, in touch events) -------------------
    onPageTouchStart(e) {
      if (this.data.closing || !e.touches || !e.touches.length) return;
      const t = e.touches[0];
      this.__drag = {
        x: t.clientX,
        y: t.clientY,
        lastRaw: 0,
        v: 0,
        moved: false,
      };
    },
    onPageTouchMove(e) {
      const d = this.data;
      const drag = this.__drag;
      if (!drag || d.closing) return;
      const t = e.touches[0];
      // signed displacement along the axis that puts the slip away
      let raw;
      if (d.direction === 'bottom') raw = t.clientY - drag.y;
      else if (d.direction === 'top') raw = drag.y - t.clientY;
      else if (d.direction === 'right') raw = t.clientX - drag.x;
      else raw = drag.x - t.clientX;
      if (!drag.moved && Math.abs(raw) < 8) return;
      drag.moved = true;
      // flick velocity along the axis (px/ms)
      drag.v = (raw - drag.lastRaw) / 16;
      drag.lastRaw = raw;
      const axis = d.direction === 'left' || d.direction === 'right' ? 'X' : 'Y';
      const win = axis === 'X' ? this.__winW : this.__winH;
      if (d.snapPoints && d.snapPoints.length) {
        // snap drawers: the drag slides the parked slip (translate only —
        // the sheet's size never changes, so the drawn face stays valid)
        const g = this.__snapGeom();
        const t0 = g.tAt(this.__snapIndex || 0);
        const t = Math.min(Math.max(t0 + raw, 0), g.maxPx);
        this.__dragT = t;
        this.setData({
          dragging: true,
          pageStyle: `transform:translate${g.axis}(${t}px);${g.size}transition:none;`,
          dimStyle: this.__dimAtT(t, g),
        });
        return;
      }
      // plain drawers: the drag translates the slip; against the edge
      // rubber-bands at 20%
      const off = raw >= 0 ? raw : raw * 0.2;
      const dir = d.direction === 'top' || d.direction === 'left' ? -1 : 1;
      this.__dragOff = off;
      this.setData({
        dragging: true,
        pageStyle: `transform:translate${axis}(${off * dir}px);transition:none;`,
        dimStyle: `opacity:${Math.max(1 - off / win, 0.1).toFixed(3)};`,
      });
    },
    onPageTouchEnd() {
      const d = this.data;
      const drag = this.__drag;
      this.__drag = null;
      if (!drag || !drag.moved || d.closing) return;
      const axis = d.direction === 'left' || d.direction === 'right' ? 'X' : 'Y';
      const win = axis === 'X' ? this.__winW : this.__winH;
      // snap drawers: settle on the nearest resting height; a flick goes
      // with the flick; dragged past the sill from the first snap puts it away
      if (d.snapPoints && d.snapPoints.length) {
        const g = this.__snapGeom();
        const t = this.__dragT === undefined ? g.tAt(this.__snapIndex || 0) : this.__dragT;
        this.__dragT = undefined;
        const sill = g.tAt(0);
        if (d.dismissible && t > sill + win * 0.08) {
          this.__requestClose();
          return;
        }
        let best = 0;
        let bestD = Infinity;
        for (let i = 0; i < d.snapPoints.length; i++) {
          const dd = Math.abs(g.tAt(i) - t);
          if (dd < bestD) {
            bestD = dd;
            best = i;
          }
        }
        // the flick picks the neighbour in its direction
        if (Math.abs(drag.v) > FLICK_V && best === this.__snapIndex) {
          const next = drag.v > 0 ? this.__snapIndex - 1 : this.__snapIndex + 1;
          if (next >= 0 && next < d.snapPoints.length) best = next;
        }
        best = Math.min(Math.max(best, 0), d.snapPoints.length - 1);
        this.__applySnap(best, true);
        this.triggerEvent('snapchange', { index: best, snap: d.snapPoints[best] });
        return;
      }
      const off = this.__dragOff || 0;
      this.__dragOff = 0;
      // plain drawers: past 25% of the edge (or a flick) puts it away
      const limit = win * 0.25;
      if (d.dismissible && (off > limit || (drag.v > FLICK_V && off > 24))) {
        this.__requestClose();
        return;
      }
      // spring back
      this.setData({
        dragging: false,
        pageStyle: `transform:translate${axis}(0);transition:transform ${EXIT_MS}ms ease-out;`,
        dimStyle: 'opacity:1;',
      });
    },
    noop() {},
  },
});
