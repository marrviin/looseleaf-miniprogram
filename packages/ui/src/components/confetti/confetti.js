/**
 * ll-confetti — upstream Confetti (confetti.tsx) + confetti-ink.ts.
 *
 * Upstream creates one element per piece and drives it with the Web
 * Animations API. Miniprogram has neither DOM nor WAAPI, so the component
 * composites the whole burst into ONE container-sized SVG data URI with the
 * animation inside: each piece nests three <animateTransform>s (translate →
 * rotate → scale(1,flip); SMIL replaces its target's transform, hence the
 * nesting) plus an <animate opacity> (values 1;1;0 keyTimes 0;0.72;1 — the
 * exact upstream fade). Keyframes sample every 2nd flight frame (100ms —
 * paper drift doesn't need 50ms), which keeps a 90-piece burst around
 * 100KB of SVG.
 *
 * The layer clears itself after duration (+400ms buffer), fires `done`
 * (upstream onDone), and `active` / `burstKey` mirror the upstream effects.
 */
import { createComponent } from '../../common/component';
import { props } from './props';
import { resolvePaint } from '../../common/ink';
import {
  confettiPiece,
  simulate,
  svgDataUrl,
  STEP_MS,
  CONFETTI_KINDS,
  CONFETTI_COLORS,
} from '../../common/ink-engine';

const SAMPLE_EVERY = 2; // 100ms keyframes over the 50ms flight frames
const num = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const f1 = (n) => String(Math.round(n * 10) / 10);

createComponent({
  options: { styleIsolation: 'isolated' },
  properties: props,
  data: {
    layerStyle: '',
  },
  observers: {
    active(next) {
      if (this._st && next && !this._st.wasActive) this.burst();
      if (this._st) this._st.wasActive = !!next;
    },
    burstKey(next) {
      if (!this._st) return;
      if (next != null && next !== this._st.burstKey) {
        this._st.burstKey = next;
        this.burst();
      }
    },
  },
  lifetimes: {
    attached() {
      this._st = { burstKey: this.data.burstKey, wasActive: !!this.data.active, timer: null, seq: 0 };
    },
    detached() {
      if (this._st && this._st.timer) clearTimeout(this._st.timer);
    },
  },
  methods: {
    __measureBox(cb) {
      this.createSelectorQuery()
        .select('.ll-confetti')
        .boundingClientRect((rect) => {
          if (!rect || !rect.width) {
            setTimeout(() => this.__measureBox(cb), 120);
            return;
          }
          cb({ w: Math.round(rect.width), h: Math.round(rect.height) });
        })
        .exec();
    },
    /** One burst. `opts` takes the same keys as the properties. */
    burst(opts = {}) {
      const d = this.data;
      const st = this._st;
      if (!st) return;
      const pick = (key, fallback) => (opts[key] != null ? opts[key] : d[key] != null ? d[key] : fallback);
      const conf = {
        count: num(pick('count', 70), 70),
        spread: num(pick('spread', 70), 70),
        angle: num(pick('angle', 90), 90),
        velocity: num(pick('velocity', 1100), 1100),
        gravity: num(pick('gravity', 520), 520),
        drift: num(pick('drift', 0), 0),
        duration: num(pick('duration', 2600), 2600),
        scalar: num(pick('scalar', 1), 1),
        colors: opts.colors || d.colors || CONFETTI_COLORS,
        shapes: opts.shapes || d.shapes || CONFETTI_KINDS,
        seed: pick('seed', null),
        origin: opts.origin != null ? opts.origin : d.origin,
      };
      this.__measureBox((box) => {
        const seq = ++st.seq;
        // origin: a container-relative point; default the center
        let ox = box.w / 2;
        let oy = box.h / 2;
        const o = conf.origin;
        if (o && typeof o.x === 'number') {
          ox = o.x;
          oy = typeof o.y === 'number' ? o.y : oy;
        }
        const flights = simulate(
          {
            count: Math.min(400, Math.max(0, Math.round(conf.count))),
            spread: conf.spread,
            angle: conf.angle,
            velocity: conf.velocity,
            gravity: conf.gravity,
            drift: conf.drift,
            duration: conf.duration,
            seed: conf.seed != null ? Number(conf.seed) : Math.floor(Math.random() * 1e9),
          },
          conf.shapes,
          conf.colors,
        );
        const pieces = flights.map((fl) => this.__pieceMarkup(fl, ox, oy, conf.scalar));
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${box.w} ${box.h}" width="${box.w}" height="${box.h}">${pieces.join('')}</svg>`;
        const uri = svgDataUrl(resolvePaint(svg));
        this.setData({ layerStyle: `background-image:url("${uri}");` });
        if (st.timer) clearTimeout(st.timer);
        st.timer = setTimeout(() => {
          st.timer = null;
          if (seq === st.seq) this.setData({ layerStyle: '' });
          this.triggerEvent('done', {});
        }, conf.duration + 400);
      });
    },
    /** Cut every flight and clear the layer (the upstream stop handle). */
    stop() {
      const st = this._st;
      if (st && st.timer) clearTimeout(st.timer);
      if (st) st.timer = null;
      this.setData({ layerStyle: '' });
    },
    /** One piece: translate → rotate → scale(1,flip), opacity fade. */
    __pieceMarkup(fl, ox, oy, scalar) {
      const p = confettiPiece(fl.kind, fl.color, fl.variant);
      const k = fl.scale * scalar;
      const frames = fl.frames;
      const idx = [];
      for (let i = 0; i < frames.length; i += SAMPLE_EVERY) idx.push(i);
      if (idx[idx.length - 1] !== frames.length - 1) idx.push(frames.length - 1);
      const dur = (frames.length - 1) * STEP_MS;
      const tr = idx.map((i) => `${f1(ox + frames[i].x)} ${f1(oy + frames[i].y)}`).join(';');
      const rot = idx.map((i) => f1(frames[i].rot)).join(';');
      const flip = idx.map((i) => `1 ${f1(frames[i].flip)}`).join(';');
      return (
        `<g><animateTransform attributeName="transform" type="translate" calcMode="linear" values="${tr}" dur="${dur}ms" fill="freeze"/>` +
        `<animate attributeName="opacity" values="1;1;0" keyTimes="0;0.72;1" dur="${dur}ms" fill="freeze"/>` +
        `<g><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="${rot}" dur="${dur}ms" fill="freeze"/>` +
        `<g><animateTransform attributeName="transform" type="scale" calcMode="linear" values="${flip}" dur="${dur}ms" fill="freeze"/>` +
        `<g transform="translate(${f1(-p.w * k / 2)} ${f1(-p.h * k / 2)}) scale(${f1(k)})">${p.svg}</g>` +
        `</g></g></g>`
      );
    },
  },
});
