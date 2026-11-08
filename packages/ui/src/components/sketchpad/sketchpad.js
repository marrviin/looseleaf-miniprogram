/**
 * ll-sketchpad — upstream Sketchpad (sketchpad.tsx) + sketchpad-ink.ts.
 *
 * The toolbar (tools / colors / sizes / undo-redo-clear) and the canvas fold
 * into one component; the composition parts don't survive as separate tags.
 *
 * Rendering: upstream injects each stroke as its own SVG <g> into a live
 * <svg viewBox="0 0 W H">. Miniprogram has no DOM, so the component
 * composites the same fragments — strokeMarkup's raw SVG pieces (canvas
 * space, grain-masked) — into ONE full-canvas SVG data URI per state:
 *   doc   — the committed strokes (re-rendered on commit/undo/erase-dim)
 *   live  — the stroke under the finger (live:true simple pens), throttled
 * grain <defs> (svgMaskDefs, same 'll' id prefix) ride inside every doc;
 * var(--ll-*) paint resolves to hex (an isolated SVG can't see the page).
 * Replay reveals stroke-by-stroke on the upstream timing curve (dur =
 * min(2.4, max(0.14, centreLength/(420·speed))), +0.08 gap) — whole strokes
 * instead of the upstream path-mask wipe; reduced motion upstream shows the
 * finished picture, so this sits between the two.
 *
 * Keyboard drawing (arrows/Space/F-B-P-M-H/E), pointer capture and pen
 * pressure are desktop-only upstream — deferred. Touch sampling mirrors the
 * pointer logic: SAMPLE_GAP 0.8, thin() to 1.5px at commit, LIVE_POINTS
 * preview cap, eraser strokeHit r9 with 0.22 dim.
 */
import { createComponent } from '../../common/component';
import { props } from './props';
import { renderLayers, hashSeed, resolvePaint } from '../../common/ink';
import {
  bucketBox,
  strokeMarkup,
  strokeHit,
  strokesToSvg,
  svgMaskDefs,
  svgDataUrl,
  DRAW_TOOLS,
  SKETCH_COLORS,
  SKETCH_SIZES,
  DARK_INKS,
} from '../../common/ink-engine';

const DEFAULT_TOOLS = ['felt', 'pencil', 'marker', 'highlighter', 'eraser'];
const HISTORY = 100;
const SAMPLE_GAP = 0.8;
const LIVE_POINTS = 480;
const LIVE_MS = 40; // live-stroke frame budget (upstream draws per rAF)
const ERASE_MS = 80; // erase-dim re-render budget
const ERASER_R = 9;

const TOOL_LABEL = { felt: 'Felt', brush: 'Brush', pencil: 'Pencil', marker: 'Marker', highlighter: 'Highlighter', eraser: 'Eraser' };
const COLOR_LABEL = { ink: 'Ink', 'ink-you': 'Blue', red: 'Red', green: 'Green', marker: 'Terracotta', tangerine: 'Orange', hi: 'Yellow', teal: 'Teal', grape: 'Purple', bubblegum: 'Pink' };
const SIZE_LABEL = { fine: 'Fine', medium: 'Medium', bold: 'Bold' };
const SIZE_NAMES = Object.keys(SKETCH_SIZES);
// stroke fragments reference grain masks per pen — the map upstream keeps
// internal (TOOL_GRAIN); the composite needs it to emit the right <defs>.
const GRAIN_OF = { felt: 'felt', brush: 'felt', pencil: 'graphite', marker: 'marker', highlighter: null };
// upstream PAPERS: paper name → Paper stock/rules on the canvas sheet
const PAPERS = {
  plain: { stock: 'paper', rules: 'none' },
  ruled: { stock: 'paper', rules: 'ruled' },
  graph: { stock: 'graph', rules: '' },
  dots: { stock: 'dot-grid', rules: '' },
  kraft: { stock: 'kraft', rules: 'none' },
};

const count = (n) => `${n} ${n === 1 ? 'stroke' : 'strokes'}`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const round1 = (n) => Math.round(n * 10) / 10;
const sizeName = (v) => SIZE_NAMES.find((k) => SKETCH_SIZES[k] === v) || '';

/** Drop points closer than 1.5px (upstream thin()) before committing. */
function thin(pts) {
  const out = [];
  for (const p of pts) {
    const last = out[out.length - 1];
    if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) >= 1.5) out.push(p);
  }
  const tail = pts[pts.length - 1];
  if (out.length > 1 && out[out.length - 1] !== tail) out.push(tail);
  return out;
}

/** Cap the live preview at LIVE_POINTS (upstream preview()). */
function preview(pts) {
  if (pts.length <= LIVE_POINTS) return pts.slice();
  let k = 2;
  while (pts.length / k > LIVE_POINTS) k *= 2;
  const out = [];
  for (let i = 0; i < pts.length; i += k) out.push(pts[i]);
  const tail = pts[pts.length - 1];
  if (out[out.length - 1] !== tail) out.push(tail);
  return out;
}

const withIds = (list) =>
  (Array.isArray(list) ? list : []).map((s, i) => (s && s.id ? s : { ...s, id: `s${i}` }));

/** Cheap content signature for the controlled-value echo check. */
const strokesSig = (list) =>
  (Array.isArray(list) ? list : []).map((s) => `${s && s.id}:${s && s.pts ? s.pts.length : 0}`).join('|');

/** Ink-layer style for a stack of layer URIs (first renders on top). */
const inkStyle = (uris, pad) =>
  uris && uris.length ? `inset:${-pad}px;background-image:${uris.map((u) => `url("${u}")`).join(',')}` : '';
/** Tool-button variant: the 64x52 sample stays centered while a long label
 *  (Highlighter) widens the button. */
const inkStyleAt = (uris) =>
  uris && uris.length
    ? `left:50%;top:-12px;width:64px;height:52px;transform:translateX(-50%);background-image:${uris.map((u) => `url("${u}")`).join(',')}`
    : '';

createComponent({
  options: { styleIsolation: 'isolated' },
  properties: props,
  data: {
    // canvas frame: the pencil frame recipe draws on .ll-sketchpad-canvas
    llInkRecipe: 'sketchpad-canvas',
    toolBtns: [],
    colorBtns: [],
    sizeBtns: [],
    curTool: 'felt',
    curColor: 'ink',
    curSizeName: 'medium',
    canUndo: false,
    canRedo: false,
    canClear: false,
    docStyle: '',
    liveStyle: '',
    announce: '',
    replaying: false,
    toolbar: true,
    rules: 'none',
    paperStyle: '',
  },
  observers: {
    // controlled inputs: value re-adopted when it's not our own emission.
    // setData deep-copies, so an emitted array never comes back by
    // reference — compare a content signature instead.
    value(next) {
      const st = this._st;
      if (!st || next == null) return;
      const sig = strokesSig(next);
      if (sig === st.lastSig) return;
      st.hist = { past: [], future: [] };
      this.__adopt(next);
    },
    tool(next) {
      if (!this._st || next == null || next === this._st.tool) return;
      this._st.tool = next;
      this.setData({ curTool: next });
    },
    color(next) {
      if (!this._st || next == null || next === this._st.color) return;
      this._st.color = next;
      this.setData({ curColor: next });
      this.__buildToolbar();
    },
    size(next) {
      if (!this._st || next == null || next === this._st.size) return;
      this._st.size = Number(next);
      this.setData({ curSizeName: sizeName(this._st.size) });
    },
  },
  lifetimes: {
    attached() {
      const d = this.data;
      const tool = d.tool != null ? d.tool : d.defaultTool;
      const color = d.color != null ? d.color : d.defaultColor;
      const size = d.size != null ? Number(d.size) : Number(d.defaultSize);
      const W = Math.max(80, Number(d.width) || 640);
      const H = Math.max(80, Number(d.height) || 400);
      this._st = {
        W,
        H,
        strokes: withIds(d.value != null ? d.value : d.defaultValue),
        controlled: d.value != null,
        lastSig: strokesSig(withIds(d.value != null ? d.value : d.defaultValue)),
        hist: { past: [], future: [] },
        counter: 0,
        tool,
        color,
        size,
        readOnly: d.readOnly,
        disabled: d.disabled,
        interactive: !d.readOnly && !d.disabled,
        tools: (d.tools && d.tools.length ? d.tools : DEFAULT_TOOLS).filter((t) => DRAW_TOOLS.includes(t) || t === 'eraser'),
        colors: d.colors && d.colors.length ? d.colors : SKETCH_COLORS,
        replaySpeed: Number(d.replaySpeed) || 1,
        gesture: null,
        rect: null,
        liveTimer: null,
        eraseTimer: null,
        timers: [],
      };
      const paper = PAPERS[d.paper] || PAPERS.plain;
      this.setData({
        toolbar: d.showToolbar && !d.readOnly,
        curTool: tool,
        curColor: color,
        curSizeName: sizeName(size),
        stock: d.stock || paper.stock,
        rules: paper.rules,
        canClear: this._st.strokes.length > 0,
      });
      this.__buildToolbar();
      this.__measure();
      if (d.replay) setTimeout(() => this.replay(), 400);
    },
    detached() {
      this.__clearTimers();
    },
  },
  methods: {
    // ---- toolbar ----------------------------------------------------------
    __buildToolbar() {
      const st = this._st;
      const seed = `${this.data.seed || ''}`;
      const draw = (recipe, box, params, salt) =>
        renderLayers(recipe, bucketBox(box.w, box.h), params, `${hashSeed(`${recipe}|${salt}|${seed}`)}`);
      this.setData({
        toolBtns: st.tools.map((t) => {
          const e = draw('sketchpad-tool', { w: 64, h: 52 }, { tool: t, color: st.color }, `${t}|${st.color}`);
          return {
            id: t,
            label: TOOL_LABEL[t] || t,
            style: inkStyleAt([e.uris.rest]),
            onStyle: inkStyleAt([e.uris.checked, e.uris.rest].filter(Boolean)),
          };
        }),
        colorBtns: st.colors.map((c) => {
          const e = draw('sketchpad-swatch', { w: 28, h: 28 }, { color: c }, c);
          return {
            id: c,
            label: COLOR_LABEL[c] || c,
            style: inkStyle([e.uris.rest], e.pad),
            onStyle: inkStyle([e.uris.checked, e.uris.rest].filter(Boolean), e.pad),
          };
        }),
        sizeBtns: SIZE_NAMES.map((name) => {
          const e = draw('sketchpad-size', { w: 28, h: 28 }, { size: name }, name);
          return {
            id: name,
            label: `${SIZE_LABEL[name]} line`,
            style: inkStyle([e.uris.rest], e.pad),
            onStyle: inkStyle([e.uris.checked, e.uris.rest].filter(Boolean), e.pad),
          };
        }),
      });
    },
    onToolTap(e) {
      const t = e.currentTarget.dataset.tool;
      const st = this._st;
      if (!st.interactive || st.tool === t) return;
      const prev = st.tool;
      st.tool = t;
      this.setData({ curTool: t });
      this.triggerEvent('toolchange', { tool: t });
      // upstream selectTool: the highlighter refuses dark inks (and gives
      // them back when you leave it)
      if (t === 'highlighter' && DARK_INKS.has(st.color)) {
        st.color = 'hi';
        this.setData({ curColor: st.color });
        this.triggerEvent('colorchange', { color: st.color });
        this.__buildToolbar();
      } else if (prev === 'highlighter' && t !== 'highlighter' && st.color === 'hi') {
        st.color = 'ink';
        this.setData({ curColor: st.color });
        this.triggerEvent('colorchange', { color: st.color });
        this.__buildToolbar();
      }
      this.__say(`${TOOL_LABEL[t]}.`);
    },
    onColorTap(e) {
      const c = e.currentTarget.dataset.color;
      const st = this._st;
      if (!st.interactive || st.color === c) return;
      st.color = c;
      this.setData({ curColor: c });
      this.triggerEvent('colorchange', { color: c });
      this.__buildToolbar();
      this.__say(`${COLOR_LABEL[c] || c}.`);
    },
    onSizeTap(e) {
      const name = e.currentTarget.dataset.size;
      const st = this._st;
      if (!st.interactive || sizeName(st.size) === name) return;
      st.size = SKETCH_SIZES[name];
      this.setData({ curSizeName: name });
      this.triggerEvent('sizechange', { size: st.size });
      this.__say(`${SIZE_LABEL[name]} line.`);
    },
    onUndo() {
      this.undo();
    },
    onRedo() {
      this.redo();
    },
    onClear() {
      this.clear();
    },

    // ---- canvas measurement & composite rendering --------------------------
    __measure() {
      this.createSelectorQuery()
        .select('.ll-sketchpad-canvas')
        .boundingClientRect((rect) => {
          if (!rect || !rect.width) {
            setTimeout(() => this.__measure(), 120);
            return;
          }
          const st = this._st;
          st.box = { w: rect.width, h: (rect.width * st.H) / st.W };
          this.setData({ paperStyle: `height:${st.box.h}px;` });
          this.__renderDoc();
        })
        .exec();
    },
    /** Full-canvas SVG data URI for one render state (doc + optional live). */
    __doc(strokes, dim, live) {
      const st = this._st;
      const grains = new Set();
      let body = '';
      for (const s of strokes) {
        const g = GRAIN_OF[s.tool];
        if (g) grains.add(g);
        const style = dim && dim.has(s.id) ? ' opacity="0.22"' : '';
        body += `<g data-stroke="${esc(s.id)}"${style}>${strokeMarkup(s).svg}</g>`;
      }
      if (live) {
        const g = GRAIN_OF[live.tool];
        if (g) grains.add(g);
        body += `<g>${strokeMarkup(live, { live: true }).svg}</g>`;
      }
      let doc = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${st.W} ${st.H}">`;
      if (grains.size) doc += `<defs>${svgMaskDefs({ kinds: [...grains] })}</defs>`;
      doc += `<g isolation="isolate">${body}</g></svg>`;
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(resolvePaint(doc))}`;
    },
    __renderDoc(dim) {
      const st = this._st;
      if (!st.box) return;
      const uri = this.__doc(st.strokes, dim, null);
      this.setData({ docStyle: `inset:0;background-image:url("${uri}");` });
    },
    __pushLive() {
      const st = this._st;
      const g = st.gesture;
      if (!g || g.tool === 'eraser' || !st.box) return;
      const now = Date.now();
      if (now - (st.lastLive || 0) < LIVE_MS) {
        if (!st.liveTimer) st.liveTimer = setTimeout(() => { st.liveTimer = null; this.__pushLive(); }, LIVE_MS);
        return;
      }
      st.lastLive = now;
      const live = { id: 'live', tool: g.tool, color: g.color, size: g.size, pts: preview(g.pts) };
      const uri = this.__doc([], null, live);
      this.setData({ liveStyle: `inset:0;background-image:url("${uri}");` });
    },
    __throttledErase() {
      const st = this._st;
      if (st.eraseTimer) return;
      st.eraseTimer = setTimeout(() => {
        st.eraseTimer = null;
        this.__renderDoc(st.gesture && st.gesture.erase);
      }, ERASE_MS);
    },

    // ---- gestures ----------------------------------------------------------
    __surfaceRect(cb) {
      this.createSelectorQuery()
        .select('#skSurface')
        .boundingClientRect((rect) => {
          if (rect && rect.width) this._st.rect = rect;
          cb(rect);
        })
        .exec();
    },
    __project(t, rect) {
      const st = this._st;
      const sx = rect && rect.width ? st.W / rect.width : 1;
      const sy = rect && rect.height ? st.H / rect.height : 1;
      return [
        round1(Math.min(st.W, Math.max(0, (t.clientX - (rect ? rect.left : 0)) * sx))),
        round1(Math.min(st.H, Math.max(0, (t.clientY - (rect ? rect.top : 0)) * sy))),
      ];
    },
    onTouchStart(e) {
      const st = this._st;
      if (!st.interactive || st.replaying || st.gesture) return;
      const t = e.changedTouches && e.changedTouches[0];
      if (!t) return;
      this.__surfaceRect((rect) => {
        if (!rect || !rect.width || st.gesture) return;
        const eraser = st.tool === 'eraser';
        const g = {
          id: t.identifier,
          tool: eraser ? 'eraser' : st.tool,
          color: st.color,
          size: st.size,
          pts: [this.__project(t, rect)],
          tail: null,
          erase: eraser ? new Set() : null,
        };
        st.gesture = g;
        if (g.erase) this.__eraseAt(g, g.pts[0][0], g.pts[0][1]);
        else this.__pushLive();
      });
    },
    onTouchMove(e) {
      const st = this._st;
      const g = st.gesture;
      if (!g) return;
      const list = e.changedTouches || [];
      let t = null;
      for (const x of list) if (x.identifier === g.id) t = x;
      if (!t || !st.rect) return;
      const p = this.__project(t, st.rect);
      const last = g.pts[g.pts.length - 1];
      if (last && Math.hypot(p[0] - last[0], p[1] - last[1]) < SAMPLE_GAP) {
        g.tail = p;
        return;
      }
      g.tail = null;
      g.pts.push(p);
      if (g.erase) this.__eraseAt(g, p[0], p[1]);
      else this.__pushLive();
    },
    onTouchEnd(e) {
      this.__finish(e, false);
    },
    onTouchCancel(e) {
      this.__finish(e, true);
    },
    __finish(e, cancel) {
      const st = this._st;
      const g = st.gesture;
      if (!g) return;
      const list = (e && (e.changedTouches || e.touches)) || [];
      let t = null;
      for (const x of list) if (x.identifier === g.id) t = x;
      if (t && !cancel && st.rect) {
        const p = this.__project(t, st.rect);
        const first = g.pts[0];
        if (g.pts.length > 1 || Math.hypot(p[0] - first[0], p[1] - first[1]) > 1) {
          const last = g.pts[g.pts.length - 1];
          if (!(last && Math.hypot(p[0] - last[0], p[1] - last[1]) < SAMPLE_GAP)) g.pts.push(p);
        }
      }
      this.__end(cancel);
    },
    __eraseAt(g, x, y) {
      const set = g.erase;
      let changed = false;
      for (const s of this._st.strokes) {
        if (!set.has(s.id) && strokeHit(s, x, y, ERASER_R)) {
          set.add(s.id);
          changed = true;
        }
      }
      if (changed) this.__throttledErase();
    },
    __end(cancel) {
      const st = this._st;
      const g = st.gesture;
      if (!g) return;
      st.gesture = null;
      if (st.liveTimer) { clearTimeout(st.liveTimer); st.liveTimer = null; }
      if (st.eraseTimer) { clearTimeout(st.eraseTimer); st.eraseTimer = null; }
      this.setData({ liveStyle: '' });
      if (g.erase) {
        const gone = g.erase;
        this.__renderDoc();
        if (!cancel && gone.size) this.__commit(st.strokes.filter((s) => !gone.has(s.id)), `Erased ${count(gone.size)}.`);
        return;
      }
      if (cancel || g.tool === 'eraser') return;
      if (g.tail) {
        // a tail held under SAMPLE_GAP keeps the last pressure (upstream end())
        const held = g.pts[g.pts.length - 1][2];
        g.pts.push(held !== undefined && g.tail[2] === undefined ? [g.tail[0], g.tail[1], held] : g.tail);
      }
      this.__commit([...st.strokes, { id: this.__nextId(), tool: g.tool, color: g.color, size: g.size, pts: thin(g.pts) }], 'Stroke added.');
    },

    // ---- history & state ---------------------------------------------------
    __nextId() {
      const st = this._st;
      const used = new Set(st.strokes.map((s) => s.id));
      let id;
      do id = `s${(st.counter++).toString(36)}`;
      while (used.has(id));
      return id;
    },
    __adopt(list) {
      const st = this._st;
      st.strokes = withIds(list);
      st.lastSig = strokesSig(st.strokes);
      this.setData({ canClear: st.strokes.length > 0 });
      this.__renderDoc();
      this.__sync();
    },
    __commit(next, message) {
      const st = this._st;
      st.hist.past.push(st.strokes);
      if (st.hist.past.length > HISTORY) st.hist.past.shift();
      st.hist.future = [];
      this.__emit(next);
      this.__say(`${message} ${count(next.length)}.`);
    },
    __emit(next) {
      const st = this._st;
      st.lastSig = strokesSig(next);
      st.strokes = next;
      this.setData({ canClear: next.length > 0 });
      this.__renderDoc();
      this.__sync();
      this.triggerEvent('change', { strokes: next });
    },
    __sync() {
      const st = this._st;
      this.setData({ canUndo: st.hist.past.length > 0, canRedo: st.hist.future.length > 0 });
    },
    __say(message) {
      this.setData({ announce: message });
      this.triggerEvent('announce', { message });
    },
    __clearTimers() {
      const st = this._st;
      if (!st) return;
      for (const t of st.timers) clearTimeout(t);
      st.timers = [];
      if (st.liveTimer) clearTimeout(st.liveTimer);
      if (st.eraseTimer) clearTimeout(st.eraseTimer);
      st.liveTimer = null;
      st.eraseTimer = null;
    },

    // ---- public API (apiRef parity, via selectComponent) -------------------
    undo() {
      const st = this._st;
      const prev = st.hist.past.pop();
      if (!prev) return;
      st.hist.future.push(st.strokes);
      this.__emit(prev);
      this.__say(`Undone. ${count(prev.length)}.`);
    },
    redo() {
      const st = this._st;
      const next = st.hist.future.pop();
      if (!next) return;
      st.hist.past.push(st.strokes);
      this.__emit(next);
      this.__say(`Redone. ${count(next.length)}.`);
    },
    clear() {
      const st = this._st;
      if (!st.strokes.length) return;
      this.__commit([], 'Cleared.');
    },
    replay() {
      const st = this._st;
      if (!st.strokes.length) return;
      this.__clearTimers();
      st.replaying = true;
      this.setData({ replaying: true, liveStyle: '' });
      this.__renderDoc([]);
      let t = 0.2;
      const timers = [];
      st.strokes.forEach((s, i) => {
        const dur = Math.min(2.4, Math.max(0.14, strokeMarkup(s).length / (420 * st.replaySpeed)));
        const at = (t + dur) * 1000;
        t += dur + 0.08;
        timers.push(setTimeout(() => this.__renderDoc(st.strokes.slice(0, i + 1)), at));
      });
      timers.push(setTimeout(() => {
        st.replaying = false;
        this.setData({ replaying: false });
      }, t * 1000 + 100));
      st.timers = timers;
    },
    strokes() {
      return this._st.strokes;
    },
    toSVG(o = {}) {
      const st = this._st;
      return strokesToSvg(st.strokes, {
        width: st.W,
        height: st.H,
        margin: o.margin,
        title: o.title,
        background: o.background === false ? undefined : resolvePaint('var(--ll-paper)'),
        resolve: (name) => resolvePaint(`var(${name})`),
      });
    },
    toDataURL(o = {}) {
      return svgDataUrl(this.toSVG(o));
    },
  },
});
