/**
 * ll-typewriter — upstream Typewriter (typewriter.tsx) + typewriter-ink.ts.
 *
 * The typing plan comes from typingPlan (uneven pace, holds at the comma
 * and the period) and plays on a setTimeout chain; every step is one
 * setData of the shown string (floored at 16ms). Words carry the upstream
 * per-word jitter — a relative top shift and a near-1 opacity, both baked
 * per word (the upstream CSS-var + color-mix trick has no equivalent).
 *
 * The caret is the typewriter-caret recipe at the root's measured font
 * size; it blinks via a steps(1) keyframe while idle and stays solid while
 * typing. reserve holds the final height with an invisible spacer (longest
 * phrase / the joined lines) and absolutely positions the live text over it.
 */
import { createComponent } from '../../common/component';
import { props } from './props';
import { renderLayers, hashSeed } from '../../common/ink';
import { bucketBox, typingPlan } from '../../common/ink-engine';

const MIN_GAP = 16; // setData floor between steps
const TYPING_TAIL = 260; // 'typing' state lingers this long (upstream rest)

// caret box in em, upstream CARET_CLASS / RESERVE_CARET
const CARET = {
  block: { w: 0.6, h: 1.1, reserve: 0.6 },
  bar: { w: 0.16, h: 1.15, reserve: 0.22 },
  underscore: { w: 0.6, h: 1.15, reserve: 0.6 },
};

const isSpace = (s) => /^\s+$/.test(s);

/** Split shown text into lines → word items with baked jitter. */
function layout(shown, seed, jitterRng) {
  const lines = String(shown).split('\n');
  return lines.map((line) => {
    const words = line.split(/(\s+)/);
    const items = [];
    for (const w of words) {
      if (!w) continue;
      if (isSpace(w)) {
        items.push({ space: true, text: w });
        continue;
      }
      const jy = jitterRng();
      const jo = jitterRng();
      items.push({
        space: false,
        text: w,
        top: (Math.round((jy * 1.6 - 0.8) * 100) / 100).toFixed(2),
        opacity: (Math.round((0.9 + jo * 0.1) * 100) / 100).toFixed(2),
      });
    }
    return { items };
  });
}

// a deterministic per-instance jitter stream (upstream makeRng('type-words|seed'))
function makeJitter(seed) {
  let h = 2166136261;
  const s = `type-words|${seed}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

createComponent({
  options: { styleIsolation: 'isolated' },
  properties: props,
  data: {
    lines: [],
    reserveLines: [],
    caretStyle: '',
    caretBlink: false,
    hiddenText: '',
  },
  observers: {
    'text, mode, speed, pause, loop, cursor, reserve'() {
      if (!this._st) return; // attached() runs the first plan
      this.__restart();
    },
  },
  lifetimes: {
    attached() {
      const d = this.data;
      const phrases = Array.isArray(d.text) ? d.text.slice() : [String(d.text)];
      this._st = {
        phrases,
        mode: d.mode,
        speed: Number(d.speed) || 22,
        pause: Number(d.pause) || 1400,
        loop: d.loop,
        shape: d.cursor && CARET[d.cursor] ? d.cursor : '',
        seed: `${d.seed || ''}`,
        timers: [],
        visible: !d.startOnView,
        running: false,
      };
      this.__setRoom();
      this.__renderCaret();
      this.__play();
      if (d.startOnView) this.__observeView();
    },
    detached() {
      this.__stopTimers();
      if (this._io) {
        this._io.disconnect();
        this._io = null;
      }
    },
  },
  methods: {
    __stopTimers() {
      const st = this._st;
      if (!st) return;
      for (const t of st.timers) clearTimeout(t);
      st.timers = [];
    },
    __room() {
      const st = this._st;
      return st.mode === 'cycle'
        ? st.phrases.reduce((a, b) => (b.length > a.length ? b : a), '')
        : st.phrases.join('\n');
    },
    __setRoom() {
      const st = this._st;
      const room = this.__room();
      // the reserve spacer re-runs the same jitter sequence so the hidden
      // room wraps identically to the live text
      this.setData({
        reserveLines: layout(room, st.seed, makeJitter(st.seed)),
        hiddenText: st.mode === 'cycle' ? st.phrases.join('. ') : room,
      });
    },
    __renderCaret() {
      const st = this._st;
      const shape = st.shape;
      if (!shape) {
        this.setData({ caretStyle: '' });
        return;
      }
      this.createSelectorQuery()
        .select('.ll-typewriter')
        .fields({ computedStyle: ['font-size'] }, (res) => {
          if (!res || !res['font-size']) return;
          const fs = parseFloat(res['font-size']) || 16;
          const c = CARET[shape] || CARET.bar;
          const w = Math.max(2, fs * c.w);
          const h = Math.max(4, fs * c.h);
          const e = renderLayers(
            'typewriter-caret',
            bucketBox(Math.round(w), Math.round(h)),
            { shape },
            hashSeed(`${st.seed}|caret`),
          );
          if (!e.uris.rest) return;
          this.setData({
            caretStyle: `width:${w.toFixed(1)}px;height:${h.toFixed(1)}px;background-image:url("${e.uris.rest}");`,
          });
        })
        .exec();
    },
    __observeView() {
      if (this._io) this._io.disconnect();
      const io = wx.createIntersectionObserver(this, { thresholds: [0.4] });
      this._io = io;
      io.relativeToViewport().observe('.ll-typewriter', (res) => {
        if (res && res.intersectionRatio >= 0.4) {
          if (this._io) {
            this._io.disconnect();
            this._io = null;
          }
          if (this._st && !this._st.visible) {
            this._st.visible = true;
            this.__play();
          }
        }
      });
    },
    __play() {
      const st = this._st;
      this.__stopTimers();
      const final = st.mode === 'cycle' ? st.phrases[st.phrases.length - 1] || '' : st.phrases.join('\n');
      if (!st.visible) {
        this.setData({ lines: layout(final, st.seed, makeJitter(st.seed)), caretBlink: false });
        return;
      }
      const { steps } = typingPlan(st.phrases, {
        speed: st.speed,
        pause: st.pause,
        mode: st.mode,
        loop: st.loop,
        seed: st.seed,
      });
      const done = () => {
        st.running = false;
        this.setData({ caretBlink: true });
        this.triggerEvent('done', {});
      };
      st.running = true;
      const at = (i) => {
        const step = steps[i];
        this.setData({
          lines: layout(step.text, st.seed, makeJitter(st.seed)),
          caretBlink: false,
        });
        clearTimeout(st.rest);
        st.rest = setTimeout(() => {
          if (st.running && !st.loop) this.setData({ caretBlink: true });
        }, TYPING_TAIL);
        st.timers.push(st.rest);
        if (i + 1 < steps.length) {
          const gap = Math.max(MIN_GAP, steps[i + 1].at - step.at);
          const t = setTimeout(() => at(i + 1), gap);
          st.timers.push(t);
        } else if (st.loop) {
          const t = setTimeout(() => at(0), 120);
          st.timers.push(t);
        } else {
          done();
        }
      };
      const first = setTimeout(() => at(0), Math.max(0, Number(this.data.delay) || 0));
      st.timers.push(first);
    },
    /** Replay from the top (upstream remounts with a new key). */
    restart() {
      this.__restart();
    },
    __restart() {
      const st = this._st;
      const d = this.data;
      this.__stopTimers();
      st.phrases = Array.isArray(d.text) ? d.text.slice() : [String(d.text)];
      st.mode = d.mode;
      st.speed = Number(d.speed) || 22;
      st.pause = Number(d.pause) || 1400;
      st.loop = d.loop;
      st.shape = d.cursor && CARET[d.cursor] ? d.cursor : '';
      st.running = false;
      st.visible = !d.startOnView;
      this.__setRoom();
      this.__renderCaret();
      this.__play();
      if (d.startOnView && !st.visible) this.__observeView();
    },
  },
});
