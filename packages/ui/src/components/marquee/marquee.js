/**
 * ll-marquee — upstream Marquee (marquee.tsx) + marquee-ink.ts.
 *
 * The tape band behind the strip is the marquee-band recipe at the root's
 * measured box; the round pause control is marquee-control at 28px, and
 * toggling re-renders it with params {paused} (pause bar ⇄ two play bars).
 *
 * Upstream animates the track by a CSS var (−100/copies %). A keyframe can
 * reference a var here (the webview drops it, same as color-mix), so each
 * GROUP animates itself by a fixed translateX(-100%) — its own width —
 * with all groups in step; because the groups repeat the same content the
 * loop is seamless, and pause/reverse are plain animation-play-state /
 * animation-direction. The loop duration is one group width / speed, and
 * the group is copied enough times to cover the viewport plus one.
 *
 * Slotted children can't be stamped N times in a mini-program, so the
 * lines arrive as an `items` array and the star separator is drawn here.
 */
import { createComponent } from '../../common/component';
import { props } from './props';
import { renderLayers, hashSeed } from '../../common/ink';
import { bucketBox } from '../../common/ink-engine';

const MAX_COPIES = 48;
const CONTROL = { w: 28, h: 28 };

createComponent({
  options: { styleIsolation: 'isolated' },
  properties: props,
  data: {
    pausedNow: false,
    copies: [0, 1],
    dur: 30,
    groupAnim: '',
    bandStyle: '',
    controlStyle: '',
  },
  observers: {
    'items, speed'() {
      if (!this._st) return; // attached() measures the first time
      this.__measure();
    },
    'tape, color, seed'() {
      if (!this._st) return;
      this.__renderBand();
    },
    paused(p) {
      if (p === null || p === undefined) return;
      this.setData({ pausedNow: !!p });
      this.__renderControl(!!p);
    },
  },
  lifetimes: {
    attached() {
      const d = this.data;
      this._st = { seed: `${d.seed || ''}` };
      const paused = d.paused !== null && d.paused !== undefined ? !!d.paused : !!d.defaultPaused;
      this.setData({ pausedNow: paused });
      this.__renderControl(paused);
      // measure after the first layout (fonts may still land later — the
      // width only shifts by a few px, the loop stays seamless)
      setTimeout(() => this.__measure(), 50);
    },
  },
  methods: {
    /** Uncontrolled state, unless `paused` is set from outside. */
    __paused() {
      const d = this.data;
      return d.paused !== null && d.paused !== undefined ? !!d.paused : !!d.pausedNow;
    },
    __measure() {
      const st = this._st;
      if (!st) return;
      this.createSelectorQuery()
        .select('.ll-marquee')
        .boundingClientRect()
        .select('.ll-marquee__viewport')
        .boundingClientRect()
        .select('.ll-marquee__group')
        .boundingClientRect()
        .exec((res) => {
          if (!res || !res[0] || !res[2]) return;
          const root = res[0];
          const group = res[2];
          const vw = res[1] ? res[1].width : root.width;
          const gw = group.width;
          if (!(gw > 0) || !(root.width > 0)) return;
          st.rootW = Math.round(root.width);
          st.rootH = Math.round(root.height);
          const copies = Math.min(MAX_COPIES, Math.max(2, Math.ceil(vw / gw) + 1));
          const dur = Math.max(4, gw / Math.max(1, Number(this.data.speed) || 60));
          const list = [];
          for (let i = 0; i < copies; i++) list.push(i);
          this.setData({
            copies: list,
            dur: Math.round(dur * 100) / 100,
            groupAnim: `animation-duration:${dur.toFixed(2)}s;`,
          });
          this.__renderBand();
        });
    },
    __renderBand() {
      const st = this._st;
      if (!st || !st.rootW) return;
      const d = this.data;
      const e = renderLayers(
        'marquee-band',
        bucketBox(st.rootW, st.rootH),
        // '' must become undefined so the tape falls back to its
        // per-kind default accent (upstream: color ?? WASHI_DEFAULT)
        { kind: d.tape, color: d.color || undefined },
        hashSeed(`${st.seed}|band`),
      );
      if (!e.uris.rest) return;
      this.setData({
        bandStyle: `background-image:url("${e.uris.rest}");`,
      });
    },
    __renderControl(paused) {
      const st = this._st;
      if (!st) return;
      const e = renderLayers(
        'marquee-control',
        bucketBox(CONTROL.w, CONTROL.h),
        { paused },
        hashSeed(`${st.seed}|control`),
      );
      if (!e.uris.rest) return;
      this.setData({
        controlStyle: `width:${CONTROL.w}px;height:${CONTROL.h}px;background-image:url("${e.uris.rest}");`,
      });
    },
    onToggle() {
      const next = !this.__paused();
      const d = this.data;
      if (d.paused === null || d.paused === undefined) this.setData({ pausedNow: next });
      this.__renderControl(next);
      this.triggerEvent('pausedchange', { paused: next });
    },
  },
});
