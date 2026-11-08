import { createComponent } from '../../common/component';
import { RECIPES, runRecipe, stickerFace, stickerLabel, composeBoardSvg, HANDLE } from '../../common/ink-engine';
import { svgDataUri, resolvePaint, hashSeed } from '../../common/ink';
import { props } from './props';

const ZOOM = 1.1;
const RUN_REQ = { tier: 'lo', density: 'comfortable', knobs: { wobble: 1, misreg: 1, bleed: 1, width: 1 }, dir: 'ltr' };

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const round2 = (v) => Math.round(v * 100) / 100;
/** Upstream turnTo — normalize to (-180, 180]. */
const turnTo = (deg) => {
  const a = Math.round(((((deg + 180) % 360) + 360) % 360) * 10) / 10 - 180;
  return a === -180 ? 180 : Math.round(a * 10) / 10;
};

const finite = (v, fallback) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback);

/** Upstream wholeItems — mend hand-written JSON (rot/scale/z missing). */
const wholeItems = (items) =>
  (items || []).map((s, i) => ({
    id: String(s.id ?? i),
    name: String(s.name ?? ''),
    x: finite(s.x, 160),
    y: finite(s.y, 120),
    rot: finite(s.rot, 0),
    scale: finite(s.scale, 1) > 0 ? finite(s.scale, 1) : 1,
    z: finite(s.z, i),
  }));

/** Upstream addSticker — a fresh id (name-1, name-2…), a small turn seeded
    from the id, a position that fans out around the canvas center. */
const addSticker = (items, name, o = {}) => {
  const used = new Set(items.map((s) => s.id));
  let k = 1;
  while (used.has(`${name}-${k}`)) k++;
  const id = o.id && !used.has(o.id) ? o.id : `${name}-${k}`;
  const cx = o.x ?? (o.canvas ? o.canvas.width / 2 : 160) + ((items.length % 5) - 2) * 18;
  const cy = o.y ?? (o.canvas ? o.canvas.height / 2 : 120) + ((items.length % 4) - 1.5) * 14;
  const rot = o.rot ?? Math.round(((hashSeed(id) % 1600) / 100 - 8) * 10) / 10;
  const z = items.reduce((m, s) => Math.max(m, Number.isFinite(s.z) ? s.z : 0), -1) + 1;
  return [...items, { id, name, x: Math.round(cx), y: Math.round(cy), rot, scale: o.scale ?? 1, z }];
};

/** Upstream reorderSticker — z re-ranked 0..n-1, or the same array. */
const reorderSticker = (items, id, how) => {
  const sorted = [...items].sort((a, b) => a.z - b.z);
  const i = sorted.findIndex((s) => s.id === id);
  if (i < 0) return items;
  const [it] = sorted.splice(i, 1);
  const to = how === 'front' ? sorted.length : how === 'back' ? 0 : how === 'forward' ? Math.min(i + 1, sorted.length) : Math.max(i - 1, 0);
  if (to === i && how !== 'front' && how !== 'back') return items;
  sorted.splice(to, 0, it);
  const rank = new Map(sorted.map((s, k) => [s.id, k]));
  return items.map((s) => ({ ...s, z: rank.get(s.id) ?? s.z }));
};

/** Where a sticker may go (upstream keepIn). */
const keepIn = (x, y, art, canvas, mode) => {
  if (mode === 'none' || !canvas.w || !canvas.h) return [x, y];
  if (mode === 'center') return [clamp(x, 0, canvas.w), clamp(y, 0, canvas.h)];
  const a = (art.rot * Math.PI) / 180;
  const c = Math.abs(Math.cos(a));
  const s = Math.abs(Math.sin(a));
  const ex = Math.min(canvas.w / 2, (art.w * art.scale * c + art.h * art.scale * s) / 2);
  const ey = Math.min(canvas.h / 2, (art.w * art.scale * s + art.h * art.scale * c) / 2);
  return [clamp(x, ex, canvas.w - ex), clamp(y, ey, canvas.h - ey)];
};

const wrapSvg = (inner, w, h) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${resolvePaint(inner)}</svg>`
  )}`;

/** Upstream `StickerBoard` (+ Canvas + Toolbar, folded in): a page you can
    stick stickers on — drag them anywhere, turn them by the ring above and
    size them by the square at the corner; the toolbar does the same. The
    value is plain JSON { id, name, x, y, rot, scale, z } and it exports to
    one standalone SVG. No keyboard on a phone: every key upstream describes
    has a toolbar/touch equivalent here, and selection is internal
    (upstream also allows controlled) — mirror it with `bind:selectedchange`.
    Events: `valuechange` {value}, `selectedchange` {value}, `export`
    {items, json, svg, width, height}. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    cells: [],
    sel: '',
    editable: true,
    hit: HANDLE.hit,
    turnOut: 5 + HANDLE.rotateUp,
    sizeOut: 5 + HANDLE.scaleOut - HANDLE.scaleSize / 2,
    // toolbar groups (upstream StickerBoardToolbar actions)
    hasTurn: true,
    hasSize: true,
    hasLayer: true,
    hasEdit: true,
    hasExport: true,
  },
  observers: {
    value() {
      if (Array.isArray(this.data.value)) this.__rebuild();
    },
    size() {
      this.__rebuild();
    },
    'readOnly, disabled'() {
      this.setData({ editable: !this.data.readOnly && !this.data.disabled });
      this.__rebuild();
    },
  },
  lifetimes: {
    attached() {
      this.setData({ editable: !this.data.readOnly && !this.data.disabled });
      this.__syncActions();
      if (!Array.isArray(this.data.value) && Array.isArray(this.data.defaultValue)) {
        this.__inner = wholeItems(this.data.defaultValue);
      }
      this.__rebuild();
      this.__measureCanvas(0);
    },
  },
  methods: {
    noop() {},
    __syncActions() {
      const actions = this.data.actions;
      const has = (a) => (Array.isArray(actions) ? actions.includes(a) : true);
      this.setData({
        hasTurn: has('turn'),
        hasSize: has('size'),
        hasLayer: has('layer'),
        hasEdit: has('duplicate') || has('delete'),
        hasExport: has('export'),
      });
    },
    // --- state ---------------------------------------------------------------
    __items() {
      return Array.isArray(this.data.value) ? wholeItems(this.data.value) : this.__inner || [];
    },
    __commit(next) {
      if (Array.isArray(this.data.value)) {
        // controlled: report only; the observer rebuilds when the prop moves
      } else {
        this.__inner = next;
      }
      this.triggerEvent('valuechange', { value: next });
      if (!Array.isArray(this.data.value)) this.__rebuild();
    },
    __select(id) {
      if ((id || '') === this.data.sel) return;
      this.setData({ sel: id || '' });
      this.triggerEvent('selectedchange', { value: id || null });
      this.__rebuild();
    },
    __patch(id, change) {
      this.__commit(this.__items().map((s) => (s.id === id ? { ...s, ...change } : s)));
    },
    __cellOf(it) {
      const d = this.data;
      const face = stickerFace(it.name, Math.max(32, Math.round(Number(d.size) || 96)), it.id, { idPrefix: 'll-sb' });
      if (!face) return null;
      const bw = face.box.w;
      const bh = face.box.h;
      const sel = d.editable && d.sel === it.id;
      let frameStyle = '';
      if (sel) {
        const recipe = RECIPES['sticker-board-item'];
        if (recipe) {
          const frame = runRecipe(recipe, {
            ...RUN_REQ,
            box: { w: bw, h: bh },
            params: { selected: true, handles: d.editable },
            seed: hashSeed(`board:${it.id}`),
            lazy: [],
          });
          frameStyle =
            `left:${-frame.pad}px;top:${-frame.pad}px;` +
            `width:${bw + frame.pad * 2}px;height:${bh + frame.pad * 2}px;` +
            `background-image:url("${svgDataUri(frame.parts.rest, frame)}");`;
        }
      }
      const uri = wrapSvg(face.svg, face.w, face.h);
      return {
        ...it,
        label: stickerLabel(it.name),
        uri,
        artW: face.w,
        artH: face.h,
        bw,
        bh,
        bx: face.box.x,
        by: face.box.y,
        artStyle:
          `width:${face.w}px;height:${face.h}px;` +
          `background-image:url('${uri}');` +
          `transform:translate(${-face.box.x * it.scale}px,${-face.box.y * it.scale}px) scale(${it.scale});`,
        frameStyle,
        dragStyle: '',
      };
    },
    __rebuild() {
      const cells = this.__items()
        .map((it) => this.__cellOf(it))
        .filter(Boolean);
      this.setData({ cells });
    },
    __measureCanvas(n) {
      this.createSelectorQuery()
        .select('.ll-sboard__canvas')
        .boundingClientRect((rect) => {
          if (rect && rect.width) {
            this.__canvas = { w: rect.width, h: rect.height, left: rect.left, top: rect.top };
          } else if (n < 300) {
            const t = [50, 250, 1000][Math.min(2, Math.floor(n / 60))] || 50;
            setTimeout(() => this.__measureCanvas(n + 1), t);
          }
        })
        .exec();
    },
    __canvasBox() {
      return { width: (this.__canvas && this.__canvas.w) || 0, height: (this.__canvas && this.__canvas.h) || 0 };
    },

    // --- gestures --------------------------------------------------------------
    /** Touch a sticker (or a handle): pick it, remember what the gesture is. */
    onDown(e) {
      const d = this.data;
      if (!d.editable) return;
      const ci = Number(e.currentTarget.dataset.ci);
      const mode = e.currentTarget.dataset.mode || 'move';
      const it = d.cells[ci];
      if (!it) return;
      this.__select(it.id);
      const t = e.touches && e.touches[0];
      if (!t) return;
      const cx = (this.__canvas ? this.__canvas.left : 0) + it.x;
      const cy = (this.__canvas ? this.__canvas.top : 0) + it.y;
      this.__drag = {
        ci,
        id: it.id,
        mode,
        sx: t.clientX,
        sy: t.clientY,
        cx,
        cy,
        a0: Math.atan2(t.clientY - cy, t.clientX - cx),
        d0: Math.max(4, Math.hypot(t.clientX - cx, t.clientY - cy)),
        x0: it.x,
        y0: it.y,
        rot0: it.rot,
        scale0: it.scale,
        x: it.x,
        y: it.y,
        rot: it.rot,
        scale: it.scale,
        moved: false,
        bw: it.bw,
        bh: it.bh,
        canvas: this.__canvasBox(),
        last: 0,
      };
      // upstream node.style.zIndex = 1000000 while dragging
      this.setData({ [`cells[${ci}].dragStyle`]: `z-index:1000000;` });
    },
    onMove(e) {
      const d = this.__drag;
      if (!d) return;
      const t = e.touches && e.touches[0];
      if (!t) return;
      const dx = t.clientX - d.sx;
      const dy = t.clientY - d.sy;
      if (!d.moved && Math.hypot(dx, dy) < 3) return;
      d.moved = true;
      if (d.mode === 'move') {
        const [x, y] = keepIn(d.x0 + dx, d.y0 + dy, { w: d.bw, h: d.bh, rot: d.rot, scale: d.scale }, d.canvas, this.data.bounds);
        d.x = x;
        d.y = y;
      } else if (d.mode === 'turn') {
        const a = Math.atan2(t.clientY - d.cy, t.clientX - d.cx);
        d.rot = turnTo(d.rot0 + ((a - d.a0) * 180) / Math.PI);
      } else {
        const dist = Math.hypot(t.clientX - d.cx, t.clientY - d.cy);
        d.scale = clamp(round2(d.scale0 * (dist / d.d0)), Number(this.data.minScale), Number(this.data.maxScale));
      }
      // styles only while the finger is down (upstream writes them directly
      // and does not render per move); throttled to ~60fps
      const now = Date.now();
      if (now - d.last < 16) return;
      d.last = now;
      this.__dragStyle();
    },
    __dragStyle() {
      const d = this.__drag;
      const it = this.data.cells[d.ci];
      if (!it) return;
      const patch = {
        [`cells[${d.ci}].dragStyle`]:
          `z-index:1000000;transform:translate(${d.x - (it.bw * d.scale) / 2}px,${d.y - (it.bh * d.scale) / 2}px) rotate(${d.rot}deg);` +
          `width:${it.bw * d.scale}px;height:${it.bh * d.scale}px;`,
      };
      if (d.mode === 'scale') {
        patch[`cells[${d.ci}].artStyle`] =
          `width:${it.artW}px;height:${it.artH}px;background-image:url('${it.uri}');` +
          `transform:translate(${-it.bx * d.scale}px,${-it.by * d.scale}px) scale(${d.scale});`;
      }
      this.setData(patch);
    },
    onUp() {
      const d = this.__drag;
      if (!d) return;
      this.__drag = null;
      const it = this.data.cells[d.ci];
      if (!it) return;
      if (!d.moved) {
        this.setData({ [`cells[${d.ci}].dragStyle`]: '' });
        return;
      }
      const change = d.mode === 'move' ? { x: Math.round(d.x), y: Math.round(d.y) } : d.mode === 'turn' ? { rot: d.rot } : { scale: d.scale };
      this.__patch(d.id, change);
    },
    onSurfaceTap() {
      if (this.data.editable) this.__select(null);
    },

    // --- board verbs (the toolbar's targets; verification hooks too) ----------
    turn(deg) {
      const id = this.data.sel;
      const it = this.__items().find((s) => s.id === id);
      if (!it) return false;
      this.__patch(id, { rot: turnTo(it.rot + deg) });
      return true;
    },
    resize(factor) {
      const id = this.data.sel;
      const it = this.__items().find((s) => s.id === id);
      if (!it) return false;
      const scale = clamp(round2(it.scale * factor), Number(this.data.minScale), Number(this.data.maxScale));
      if (scale === it.scale) return false;
      this.__patch(id, { scale });
      return true;
    },
    reorder(how) {
      const id = this.data.sel;
      if (!id) return false;
      this.__commit(reorderSticker(this.__items(), id, how));
      return true;
    },
    duplicate() {
      const id = this.data.sel;
      const it = this.__items().find((s) => s.id === id);
      if (!it) return false;
      const next = addSticker(this.__items(), it.name, { x: it.x + 20, y: it.y + 20, rot: it.rot, scale: it.scale });
      this.__commit(next);
      this.__select(next[next.length - 1].id);
      return true;
    },
    remove(id) {
      const gone = id || this.data.sel;
      const next = this.__items().filter((s) => s.id !== gone);
      if (next.length === this.__items().length) return false;
      this.__commit(next);
      this.__select(null);
      return true;
    },
    /** Sticker-sheet backfill: stick back = take everything of a name off. */
    removeName(name) {
      const next = this.__items().filter((s) => s.name !== name);
      if (next.length === this.__items().length) return false;
      this.__commit(next);
      return true;
    },
    /** Upstream addSticker as a method — sticks a new sticker on top and
        picks it (so it can be turned and sized straight away). */
    addSticker(name, o = {}) {
      const next = addSticker(this.__items(), name, { canvas: this.__canvasBox(), ...o });
      this.__commit(next);
      const id = next[next.length - 1].id;
      this.__select(id);
      return id;
    },
    /** Export the whole page as one standalone SVG. */
    exportBoard() {
      const box = this.__canvasBox();
      const width = box.width || 640;
      const height = box.height || 400;
      const items = this.__items();
      const svg = resolvePaint(composeBoardSvg(items, { width, height, size: Math.max(32, Math.round(Number(this.data.size) || 96)) }));
      const json = JSON.stringify(items, null, 2);
      this.triggerEvent('export', { items, json, svg, width, height });
      return { json, svg, width, height };
    },

    // --- toolbar ------------------------------------------------------------
    onTurnLeft() {
      this.turn(-5);
    },
    onTurnRight() {
      this.turn(5);
    },
    onSmaller() {
      this.resize(1 / ZOOM);
    },
    onLarger() {
      this.resize(ZOOM);
    },
    onBack() {
      this.reorder('back');
    },
    onBackward() {
      this.reorder('backward');
    },
    onForward() {
      this.reorder('forward');
    },
    onFront() {
      this.reorder('front');
    },
    onDuplicate() {
      this.duplicate();
    },
    onDelete() {
      this.remove();
    },
    onExport() {
      this.exportBoard();
    },
  },
});
