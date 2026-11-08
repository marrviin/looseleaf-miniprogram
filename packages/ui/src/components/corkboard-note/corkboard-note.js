import { createComponent } from '../../common/component';
import { hashSeed } from '../../common/ink';
import { props } from './props';

const PIN_COLORS = ['tomato', 'sky', 'lemon', 'grass', 'grape', 'tangerine'];

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** Upstream `CorkboardNote` — a pinned sheet on the board. Position is the
    board's value (by id) falling back to the x/y/rotate props; touch-drag
    updates local translate live and commits through board.update on drop. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    tx: 16,
    ty: 16,
    r: 0,
    zi: 1,
    dragging: false,
    pinName: 'tomato',
    labelName: '',
  },
  relations: {
    '../corkboard/corkboard': {
      type: 'ancestor',
      linked(parent) {
        this.__board = parent;
      },
      unlinked() {
        this.__board = null;
      },
    },
  },
  observers: {
    'x, y, rotate, label'() {
      this.__applyPositions();
    },
  },
  lifetimes: {
    attached() {
      this.__w = 0;
      this.__h = 0;
      this.__drag = null;
      this.__applyPositions();
      // The pin color is seeded from the id unless given (upstream).
      this.setData({ pinName: this.data.pinColor || PIN_COLORS[hashSeed(this.data.noteId || 'note') % PIN_COLORS.length] });
      setTimeout(() => this.__measure(), 0);
    },
  },
  methods: {
    /** Board push: re-read the position for our id and clamp to the cork. */
    __onBoard({ positions }) {
      this.__positions = positions;
      this.__applyPositions();
    },
    __defaults() {
      const d = this.data;
      const auto = Math.round(((hashSeed(d.noteId || 'note') % 700) / 100 - 3.5) * 10) / 10;
      return {
        x: d.x ?? 16,
        y: d.y ?? 16,
        r: d.rotate != null ? d.rotate : auto,
        z: 0,
      };
    },
    __applyPositions() {
      const at = (this.__positions || {})[this.data.noteId];
      const base = this.__defaults();
      const pos = {
        x: at?.x ?? base.x,
        y: at?.y ?? base.y,
        r: at?.r ?? base.r,
        z: at?.z ?? 0,
      };
      this.__pos = pos;
      if (!this.__drag) {
        this.setData({ tx: pos.x, ty: pos.y, r: pos.r, zi: 1 + pos.z });
      }
    },
    __measure() {
      this.createSelectorQuery()
        .select('.ll-corkboard-note')
        .boundingClientRect((rect) => {
          if (rect) {
            this.__w = rect.width;
            this.__h = rect.height;
          }
          this.__fit();
        })
        .exec();
    },
    __limits() {
      const b = this.__board ? this.__board.bounds() : { w: 0, h: 0 };
      return {
        maxX: b.w && this.__w ? Math.max(0, b.w - this.__w) : Infinity,
        maxY: b.h && this.__h ? Math.max(0, b.h - this.__h) : Infinity,
      };
    },
    __fit() {
      if (this.__drag || !this.__pos) return;
      const { maxX, maxY } = this.__limits();
      const nx = clamp(this.__pos.x, 0, maxX);
      const ny = clamp(this.__pos.y, 0, maxY);
      this.__pos = { ...this.__pos, x: nx, y: ny };
      this.setData({ tx: nx, ty: ny });
    },
    onTouchStart(e) {
      if (!this.__board || this.__board.data.disabled) return;
      const t = e.touches && e.touches[0];
      if (!t || !this.__pos) return;
      const { maxX, maxY } = this.__limits();
      const x0 = clamp(this.__pos.x, 0, maxX);
      const y0 = clamp(this.__pos.y, 0, maxY);
      this.__drag = { sx: t.clientX, sy: t.clientY, x0, y0, x: x0, y: y0, moved: false, z: this.__board.topZ() + 1 };
      this.setData({ dragging: true, tx: x0, ty: y0, zi: 1 + this.__drag.z });
    },
    onTouchMove(e) {
      const d = this.__drag;
      const t = e.touches && e.touches[0];
      if (!d || !t) return;
      const dx = t.clientX - d.sx;
      const dy = t.clientY - d.sy;
      if (!d.moved && Math.hypot(dx, dy) < 3) return;
      d.moved = true;
      const { maxX, maxY } = this.__limits();
      d.x = clamp(d.x0 + dx, 0, maxX);
      d.y = clamp(d.y0 + dy, 0, maxY);
      this.setData({ tx: d.x, ty: d.y });
    },
    onTouchEnd() {
      const d = this.__drag;
      if (!d) return;
      this.__drag = null;
      this.setData({ dragging: false });
      if (!d.moved) {
        this.setData({ zi: 1 + (this.__pos ? this.__pos.z : 0) });
        return;
      }
      const name = this.data.label || this.data.noteId;
      if (this.__board) {
        this.__board.update(this.data.noteId, { x: Math.round(d.x), y: Math.round(d.y), z: d.z }, `${name} moved to ${Math.round(d.x)}, ${Math.round(d.y)}.`);
      }
      setTimeout(() => this.__fit(), 0);
    },
  },
});
