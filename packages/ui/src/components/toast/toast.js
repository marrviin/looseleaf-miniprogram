import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { sheetShadow, tileOffsets, TOOTH_TILES } from '../../common/ink-engine';
import TOKENS from '../../common/tokens';

ensureHandFont();

/* =====================================================================
   sonner's toast store — module-level singleton.
   Upstream re-exports the sonner React package (stacking, timers, swipe,
   promise toasts and the aria-live region are sonner's own, styled from
   outside via toastOptions.classNames). WeChat has no React to host it, so
   the store lives here and every ll-toaster instance subscribes, rendering
   only the slips tagged with its own toaster-id. Pages reach the API
   through the component's methods (selectComponent) — WeChat pages can't
   require package subpaths, so there is no importable toast() module.
   ===================================================================== */

const DEFAULT_DURATION = 4000; // sonner's default
const EXIT_MS = 200; // slip-away exit animation before the record drops

let nextId = 1;
let records = [];
const listeners = new Set();
const timers = new Map(); // id -> { timer, endsAt, remaining }

function notify() {
  for (const fn of listeners) fn();
}

function subscribe(fn) {
  listeners.add(fn);
  fn();
  return () => listeners.delete(fn);
}

function arm(id, duration) {
  disarm(id);
  timers.set(id, { timer: setTimeout(() => dismiss(id), duration), endsAt: Date.now() + duration });
}

function disarm(id) {
  const t = timers.get(id);
  if (t && t.timer) clearTimeout(t.timer);
}

/** sonner pauses timers while the pointer is down on a slip. */
function pause(id) {
  const t = timers.get(id);
  if (t && t.timer) {
    clearTimeout(t.timer);
    t.timer = null;
    t.remaining = Math.max(800, t.endsAt - Date.now());
  }
}

function resume(id) {
  const t = timers.get(id);
  if (t && !t.timer && t.remaining != null) {
    t.timer = setTimeout(() => dismiss(id), t.remaining);
    t.endsAt = Date.now() + t.remaining;
  }
}

function add(type, title, opts = {}) {
  const id = nextId++;
  records = [
    ...records,
    {
      id,
      toasterId: opts.toasterId || '',
      type,
      title,
      description: opts.description || '',
      action: opts.action || null,
      cancel: opts.cancel || null,
      closing: false,
    },
  ];
  // loading toasts stay up until the promise settles (sonner: Infinity).
  const duration = opts.duration ?? (type === 'loading' ? 0 : DEFAULT_DURATION);
  if (duration > 0) arm(id, duration);
  notify();
  return id;
}

function dismiss(id) {
  if (id == null) {
    for (const t of [...records]) dismiss(t.id);
    return;
  }
  const rec = records.find((t) => t.id === id);
  if (!rec || rec.closing) return;
  disarm(id);
  timers.delete(id);
  rec.closing = true;
  notify();
  setTimeout(() => {
    records = records.filter((t) => t.id !== id);
    notify();
  }, EXIT_MS);
}

/** toast.promise — the loading slip morphs in place when the promise settles. */
function promise(p, msgs = {}, toasterId) {
  const loading = typeof msgs.loading === 'function' ? msgs.loading() : msgs.loading || 'Loading...';
  const id = add('loading', loading, { ...msgs, toasterId });
  const text = (v) => (typeof v === 'function' ? v : () => v);
  Promise.resolve(typeof p === 'function' ? p() : p).then(
    (data) => {
      const rec = records.find((t) => t.id === id);
      if (!rec) return;
      rec.type = 'success';
      rec.title = text(msgs.success)(data);
      rec.description = '';
      arm(id, DEFAULT_DURATION);
      notify();
    },
    (err) => {
      const rec = records.find((t) => t.id === id);
      if (!rec) return;
      rec.type = 'error';
      rec.title = text(msgs.error)(err);
      rec.description = '';
      arm(id, DEFAULT_DURATION);
      notify();
    },
  );
  return id;
}

/* =====================================================================
   The ll-toaster component.
   ===================================================================== */

/** Upstream data-[type=…]:paper classes + per-type --ll-tilt. Every toast
    stock is a cut edge — the face is pure CSS (color + fine tooth tiles +
    paper-light) over a sheet shadow, rotated behind upright content. */
const TYPE_FACE = {
  default: { token: '--ll-slip', shadow: 'slip', tilt: -0.3 },
  loading: { token: '--ll-slip', shadow: 'slip', tilt: 0.35 },
  success: { token: '--ll-check', shadow: 'check', tilt: -0.5 },
  error: { token: '--ll-sticky-pink', shadow: 'sticky', tilt: 0.9 },
  warning: { token: '--ll-sticky-yellow', shadow: 'sticky', tilt: -0.8 },
  info: { token: '--ll-sticky-blue', shadow: 'sticky', tilt: 0.6 },
};

/** Upstream icons overrides — drawn glyphs (loader-circle spins via CSS). */
const TYPE_ICON = {
  success: 'circle-check',
  error: 'octagon-x',
  warning: 'triangle-alert',
  info: 'info',
  loading: 'loader-circle',
};

/** --ll-paper-light with tokens precomputed (see paper.js). */
const PAPER_LIGHT =
  'linear-gradient(135deg, rgba(255,255,255,0.38), rgba(255,255,255,0) 42%, rgba(58,44,30,0.035))';

/** sheetShadow() emits rgb(var(--ll-shade) / calc(a * k)) — flatten (paper.js). */
function flattenShadow(css) {
  return css.replace(
    /rgb\(var\(--ll-shade\) \/ calc\(([\d.]+) \* var\(--ll-shadow-k\)\)\)/g,
    (_, a) => `rgba(58,44,30,${a})`,
  );
}

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    /** Upstream Toaster `id` — `id` is reserved in WeChat, so the tag ships
        as toaster-id. Slips tagged with it (via this component's methods)
        render only here. */
    toasterId: {
      type: String,
      value: '',
    },
    /** 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'. */
    position: {
      type: String,
      value: 'bottom-right',
    },
    /** Hold every slip down: 'none' | 'tape' | 'pin'. */
    decoration: {
      type: String,
      value: 'none',
    },
    closeButton: {
      type: Boolean,
      value: false,
    },
    visibleToasts: {
      type: Number,
      value: 3,
    },
    /** Accepted for API parity; the stack always renders expanded — touch
        has no hover-to-expand (sonner's collapsed stack hides the content
        of behind slips, which reads as blank paper on a phone anyway). */
    expand: {
      type: Boolean,
      value: false,
    },
    customStyle: String,
  },
  data: {
    slips: [],
  },
  observers: {
    'toasterId, position, visibleToasts'() {
      if (this.__unsub) this.__sync();
    },
  },
  lifetimes: {
    attached() {
      this.__records = new Map();
      this.__faces = new Map();
      this.__drag = new Map();
      this.__touch = null;
      this.__unsub = subscribe(() => this.__sync());
    },
    detached() {
      if (this.__unsub) this.__unsub();
    },
  },
  methods: {
    /* ---- public API (sonner's toast(), mounted on the component) ---- */
    toast(title, opts = {}) {
      return add('default', title, { ...opts, toasterId: this.data.toasterId });
    },
    success(title, opts = {}) {
      return add('success', title, { ...opts, toasterId: this.data.toasterId });
    },
    error(title, opts = {}) {
      return add('error', title, { ...opts, toasterId: this.data.toasterId });
    },
    warning(title, opts = {}) {
      return add('warning', title, { ...opts, toasterId: this.data.toasterId });
    },
    info(title, opts = {}) {
      return add('info', title, { ...opts, toasterId: this.data.toasterId });
    },
    loading(title, opts = {}) {
      return add('loading', title, { ...opts, toasterId: this.data.toasterId });
    },
    promise(p, msgs = {}) {
      return promise(p, msgs, this.data.toasterId);
    },
    dismiss(id) {
      dismiss(id);
    },

    /* ---- store → view ---- */
    __sync() {
      const d = this.data;
      const mine = records.filter((t) => (t.toasterId || '') === (d.toasterId || ''));
      this.__records = new Map(mine.map((t) => [t.id, t]));
      const bottom = (d.position || 'bottom-right').indexOf('bottom') === 0;
      const max = Math.max(1, d.visibleToasts || 3);
      let list = mine.slice(-max); // front slips are the newest
      if (!bottom) list = list.slice().reverse(); // top positions: newest renders first
      this.setData({
        slips: list.map((t) => ({
          id: t.id,
          type: t.type,
          title: t.title,
          description: t.description,
          actionLabel: (t.action && t.action.label) || '',
          cancelLabel: (t.cancel && t.cancel.label) || '',
          icon: TYPE_ICON[t.type] || '',
          spinning: t.type === 'loading',
          closing: !!t.closing,
          face: this.__face(t.type, t.id),
          drag: this.__drag.get(t.id) || '',
        })),
      });
    },

    /** Cut-edge face: stock color, fine tooth tiles, paper-light, sheet
        shadow — rotated by the type's tilt (content stays upright). */
    __face(type, id) {
      const key = `${type}:${id}`;
      const hit = this.__faces.get(key);
      if (hit) return hit;
      const F = TYPE_FACE[type] || TYPE_FACE.default;
      const tiles = TOOTH_TILES.fine;
      const sizes = tiles.map(([, w, h]) => [w, h]);
      const style =
        `transform:rotate(${F.tilt}deg);` +
        `background-color:${TOKENS[F.token]};` +
        `background-image:${tiles.map(([n]) => `var(--ll-tex-${n})`).join(',')},${PAPER_LIGHT};` +
        `background-size:${sizes.map(([w, h]) => `${w}px ${h}px`).join(',')},100% 100%;` +
        `background-position:${tileOffsets(`slip:${id}`, sizes)},0 0;` +
        `box-shadow:${flattenShadow(sheetShadow(F.shadow))};`;
      this.__faces.set(key, style);
      return style;
    },

    /* ---- slip interactions ---- */
    onActionTap(e) {
      const rec = this.__records.get(Number(e.currentTarget.dataset.id));
      if (!rec) return;
      if (rec.action && rec.action.onClick) rec.action.onClick();
      dismiss(rec.id);
    },
    onCancelTap(e) {
      const rec = this.__records.get(Number(e.currentTarget.dataset.id));
      if (!rec) return;
      if (rec.cancel && rec.cancel.onClick) rec.cancel.onClick();
      dismiss(rec.id);
    },
    onCloseTap(e) {
      dismiss(Number(e.currentTarget.dataset.id));
    },

    /* Swipe to dismiss (sonner's pointer shortcut) — drag horizontally,
       past 60px the slip tears off. The timer pauses while held. */
    onSlipTouchStart(e) {
      const id = Number(e.currentTarget.dataset.id);
      pause(id);
      this.__touch = { id, idx: e.currentTarget.dataset.idx, x: e.touches[0].clientX, last: 0 };
    },
    onSlipTouchMove(e) {
      const t = this.__touch;
      if (!t || Number(e.currentTarget.dataset.id) !== t.id) return;
      const dx = Math.round(e.touches[0].clientX - t.x);
      if (Math.abs(dx - t.last) < 2) return;
      t.last = dx;
      this.__drag.set(t.id, `transform:translateX(${dx}px);opacity:${Math.max(0.4, 1 - Math.abs(dx) / 120)};`);
      this.setData({ [`slips[${t.idx}].drag`]: this.__drag.get(t.id) });
    },
    onSlipTouchEnd(e) {
      const t = this.__touch;
      if (!t) return;
      this.__touch = null;
      resume(t.id);
      const idx = Number(e.currentTarget.dataset.idx);
      if (Math.abs(t.last) > 60) {
        this.__drag.delete(t.id);
        dismiss(t.id);
      } else if (t.last !== 0) {
        this.__drag.delete(t.id);
        this.setData({ [`slips[${idx}].drag`]: '' });
      }
    },
  },
});
