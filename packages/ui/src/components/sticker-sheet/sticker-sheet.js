import { createComponent } from '../../common/component';
import { stickerFace, kissCut, stickerLabel, hasSticker, tiltFor } from '../../common/ink-engine';
import { resolvePaint } from '../../common/ink';
import { props, validators } from './props';

const cellOf = (px) => Math.round(px + 22);
const DRAG_AT = 6;
const DRAG_OFF = 18;

const wrapSvg = (inner, w, h) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${resolvePaint(inner)}</svg>`
  )}`;

/** Upstream `StickerSheet` (+ its StickerSheetItem children, folded in):
    a sheet of kiss-cut stickers. Tap peels a sticker off (its cut outline
    stays); tap the outline to stick it back; a drag that lets go far enough
    peels too. The peel event carries {id, name, label, dragged, x, y}. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'sticker-sheet',
    llInkSelector: '.ll-sticker-sheet-print',
    stock: 'slip',
    tintOn: true,
    sheenOn: true,
    cols: 4,
    cell: 94,
    cells: [],
    cellsMeta: [],
    innerPeeled: [],
    left: 0,
    deg: 0,
  },
  lifetimes: {
    attached() {
      const d = this.data;
      if (!Array.isArray(d.peeled) && Array.isArray(d.defaultPeeled) && d.defaultPeeled.length) {
        this.setData({ innerPeeled: d.defaultPeeled.slice() });
      }
      this.__update();
    },
  },
  observers: {
    // NOTE: __update() setData's `columns` (and `cells` etc.), so an observer
    // on any field it writes re-enters forever — WeChat silently wedges the
    // appservice. The `__updating` guard below breaks that cycle.
    'stickers, columns, size, title, backing, peeled, defaultPeeled, restorable, disabled, seed, tilt'() {
      this.__update();
    },
  },
  methods: {
    /** The peeled list: controlled via the `peeled` prop, else internal. */
    __peeled() {
      const d = this.data;
      return Array.isArray(d.peeled) ? d.peeled : d.innerPeeled;
    },
    __change(next) {
      this.setData({
        innerPeeled: next,
        cells: this.__cells(next),
        left: this.__leftOf(this.data.cellsMeta, next),
      });
      this.triggerEvent('peeledchange', { peeled: next });
    },
    __leftOf(meta, peeled) {
      const known = meta.filter((c) => c.known).length;
      const unknown = meta.length - known;
      return known + unknown - meta.filter((c) => c.known && peeled.includes(c.id)).length;
    },
    __cells(peeled) {
      const d = this.data;
      return d.cellsMeta.map((c) => ({ ...c, peeled: peeled.includes(c.id) }));
    },
    __update() {
      if (this.__updating) return;
      this.__updating = true;
      try {
        this.__updateInner();
      } finally {
        this.__updating = false;
      }
    },
    __updateInner() {
      const d = this.data;
      const backing = validators.backing.includes(d.backing) ? d.backing : 'glassine';
      const px = Math.max(32, Math.round(Number(d.size) || 72));
      const cell = cellOf(px);
      const columns = Math.max(1, Number(d.columns) || 4);
      const seed = String(d.seed ?? '') || 'sticker-sheet';
      const names = Array.isArray(d.stickers) ? d.stickers : [];
      const cellsMeta = names.map((raw) => {
        const name = typeof raw === 'string' ? raw : raw && raw.name;
        const id = (typeof raw === 'object' && raw && raw.id) || name;
        const label = (typeof raw === 'object' && raw && raw.label) || stickerLabel(name);
        const known = hasSticker(name);
        const meta = { id, name, label, known, spent: false };
        const face = known ? stickerFace(name, px, id) : null;
        if (!face) return { ...meta, face: false };
        const cx = face.box.x + face.box.w / 2;
        const cy = face.box.y + face.box.h / 2;
        const at = { left: cell / 2 - cx, top: cell / 2 - cy };
        const flap = known ? stickerFace(name, px, id, { peel: true, idPrefix: 'll-ss-p' }) : null;
        return {
          ...meta,
          face: true,
          artLeft: at.left,
          artTop: at.top,
          artW: face.w,
          artH: face.h,
          faceUri: wrapSvg(face.svg, face.w, face.h),
          flapUri: flap ? wrapSvg(flap.svg, flap.w, flap.h) : '',
          cutUri: wrapSvg(kissCut(face, 'll-ss-k'), face.w, face.h),
          dragStyle: '',
          warm: false,
          dropping: false,
        };
      });
      this.__inkParams = { top: d.title ? 34 : 0 };
      let deg = 0;
      if (d.tilt !== false) {
        deg =
          typeof d.tilt === 'number' ? d.tilt : tiltFor(`tilt:${seed}`, 1.6);
      }
      const peeled = this.__peeled();
      this.setData({
        stock: backing === 'glassine' ? 'slip' : backing,
        tintOn: backing === 'glassine',
        sheenOn: backing === 'glassine',
        // NOTE: never setData a field this component's observers watch — a
        // deferred observer fire + setData of the same key ping-pongs forever
        // and silently wedges the appservice. Hence `cols`, not `columns`.
        cols: columns,
        cell,
        cellsMeta,
        cells: this.__cells(peeled),
        left: this.__leftOf(cellsMeta, peeled),
        deg,
      });
      this.__measureInk();
    },
    __peel(idx, dragged, x, y) {
      const c = this.data.cells[idx];
      if (!c || c.peeled) return;
      const next = [...this.__peeled(), c.id];
      if (Array.isArray(this.data.peeled)) {
        // Controlled: report only; the observer rebuilds when the prop moves.
        this.triggerEvent('peel', { id: c.id, name: c.name, label: c.label, dragged: !!dragged, x, y });
        this.triggerEvent('peeledchange', { peeled: next });
        return;
      }
      this.__change(next);
      this.triggerEvent('peel', { id: c.id, name: c.name, label: c.label, dragged: !!dragged, x, y });
    },
    __stick(idx) {
      const d = this.data;
      const c = d.cells[idx];
      if (!c || !c.peeled) return;
      if (!d.restorable) return;
      const next = this.__peeled().filter((id) => id !== c.id);
      if (Array.isArray(d.peeled)) {
        this.triggerEvent('stick', { id: c.id, name: c.name, label: c.label, dragged: false });
        this.triggerEvent('peeledchange', { peeled: next });
        return;
      }
      this.__change(next);
      this.triggerEvent('stick', { id: c.id, name: c.name, label: c.label, dragged: false });
    },
    /** Tap: peel / stick back (drag release suppresses the ghost tap). */
    __onTap(e) {
      if (this.data.disabled) return;
      const idx = Number(e.currentTarget.dataset.idx);
      const c = this.data.cells[idx];
      if (!c) return;
      if (c.peeled && !this.data.restorable) return;
      if (this.__drag && this.__drag.started) return;
      if (c.peeled) this.__stick(idx);
      else this.__peel(idx, false);
    },
    __onDown(e) {
      const idx = Number(e.currentTarget.dataset.idx);
      const c = this.data.cells[idx];
      if (!c || this.data.disabled) return;
      this.setData({ [`cells[${idx}].warm`]: true });
      if (c.peeled) return;
      const t = e.touches && e.touches[0];
      if (!t) return;
      this.__drag = { idx, sx: t.clientX, sy: t.clientY, started: false };
    },
    __onMove(e) {
      const d = this.__drag;
      if (!d || d.idx !== Number(e.currentTarget.dataset.idx)) return;
      const t = e.touches && e.touches[0];
      if (!t) return;
      const dx = t.clientX - d.sx;
      const dy = t.clientY - d.sy;
      if (!d.started && Math.hypot(dx, dy) < DRAG_AT) return;
      d.started = true;
      const rot = Math.max(-14, Math.min(14, dx * 0.06));
      this.setData({
        [`cells[${d.idx}].dragStyle`]: `transform:translate(${dx}px,${dy}px) rotate(${rot}deg)`,
      });
    },
    __onUp(e) {
      const idx = Number(e.currentTarget.dataset.idx);
      const d = this.__drag;
      const c = this.data.cells[idx];
      if (d && d.idx === idx) {
        const t = e.changedTouches && e.changedTouches[0];
        const far =
          d.started &&
          t &&
          Math.hypot(t.clientX - d.sx, t.clientY - d.sy) >= DRAG_OFF;
        this.__drag = null;
        if (c) {
          if (far) {
            this.__peel(idx, true, t.clientX, t.clientY);
          } else if (d.started) {
            this.setData({ [`cells[${idx}].dragStyle`]: '' });
          }
        }
      }
      if (c && !c.peeled) this.setData({ [`cells[${idx}].warm`]: false });
    },
    /** Verification hooks: peel / stick by sticker name. */
    sheetPeel(name) {
      const i = this.data.cells.findIndex((c) => c.name === name);
      if (i < 0) return { ok: false };
      this.__peel(i, false);
      return { ok: true, peeled: this.__peeled(), left: this.data.left };
    },
    sheetStick(name) {
      const i = this.data.cells.findIndex((c) => c.name === name);
      if (i < 0) return { ok: false };
      this.__stick(i);
      return { ok: true, peeled: this.__peeled(), left: this.data.left };
    },
  },
});
