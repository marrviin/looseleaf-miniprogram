import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Arrow` — a hand-drawn arrow (arrowRecipe). Without `pointAt`
    it flies a fixed direction from a 80×40 box; with `pointAt` it aims at a
    page node (measured once — the webview has no ResizeObserver). A slotted
    label rides at the direction's side in the script hand. */
const AIMED_SIZE = 24;

function vectorTo(a, b, gap) {
  const cx = a.left + a.width / 2;
  const cy = a.top + a.height / 2;
  const vx = b.left + b.width / 2 - cx;
  const vy = b.top + b.height / 2 - cy;
  const len = Math.hypot(vx, vy);
  if (len < 1) return null;
  const enter = (lo, hi, o, v) =>
    v === 0 ? (o >= lo && o <= hi ? -Infinity : Infinity) : Math.min((lo - o) / v, (hi - o) / v);
  const t = Math.max(enter(b.left, b.right, cx, vx), enter(b.top, b.bottom, cy, vy));
  if (!(t >= 0 && t <= 1)) return null;
  const reach = Math.max(0, len * t - gap);
  return { dx: Math.round(((vx / len) * reach) / 2) * 2, dy: Math.round(((vy / len) * reach) / 2) * 2 };
}

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    aimed: false,
    ready: true,
    aimStyle: '',
    llInkRecipe: 'arrow',
    llInkSelector: '.ll-arrow',
  },
  observers: {
    'direction, curve, head, tone, weight, bend, pointAt, gap'(...args) {
      const [direction, curve, head, tone, weight, bend, pointAt, _gap] = args;
      const aimed = !!pointAt;
      this.__aimed = aimed;
      this.__inkParams = aimed
        ? { direction, curve, head, tone, weight, bend, mirror: true, ...this.__vec }
        : { direction, curve, head, tone, weight, bend, mirror: true };
      const patch = { aimed, ready: !aimed || !!this.__vec };
      if (aimed) patch.aimStyle = `width:${AIMED_SIZE}px;height:${AIMED_SIZE}px;`;
      else patch.aimStyle = '';
      this.setData(patch);
      setTimeout(() => {
        if (aimed) this.__aim();
        else this.__measureInk && this.__measureInk();
      }, 0);
    },
  },
  lifetimes: {
    attached() {
      const { direction, curve, head, tone, weight, bend, pointAt } = this.data;
      const aimed = !!pointAt;
      this.__aimed = aimed;
      this.__inkParams = aimed
        ? { direction, curve, head, tone, weight, bend, mirror: true }
        : { direction, curve, head, tone, weight, bend, mirror: true };
      this.setData({ aimed, ready: !aimed, aimStyle: aimed ? `width:${AIMED_SIZE}px;height:${AIMED_SIZE}px;` : '' });
    },
  },
  methods: {
    /** Measure the host and the target, then aim the ink. */
    __aim() {
      if (!this.__aimed) return;
      const q = this.createSelectorQuery();
      q.select('.ll-arrow').boundingClientRect();
      q.exec((res) => {
        const host = res && res[0];
        if (!host) return;
        const pq = wx.createSelectorQuery();
        pq.select(this.data.pointAt).boundingClientRect();
        pq.exec((pres) => {
          const target = pres && pres[0];
          const vec = target ? vectorTo(host, target, Number(this.data.gap) || 6) : null;
          if (!vec) {
            if (this.data.ready) this.setData({ ready: false });
            return;
          }
          this.__vec = vec;
          this.__inkParams = { ...this.__inkParams, ...vec };
          if (!this.data.ready) this.setData({ ready: true });
          this.__measureInk && this.__measureInk();
        });
      });
    },
  },
});
