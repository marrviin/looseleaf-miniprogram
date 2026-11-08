/**
 * ll-reveal — upstream Reveal (reveal.tsx).
 *
 * A wrapper that arms an IntersectionObserver (wx.createIntersectionObserver
 * at the reveal threshold) and plays one of the five arrival keyframes on
 * its root — wipe/soak/drop/pop/toss, the same curves as upstream's
 * looseleaf.css, ported verbatim into the component stylesheet. nib wraps
 * the slotted content in a component-owned view (so the wipe can clip it)
 * and rides the marker-tip nib (reveal-nib recipe, 24px) along the bottom
 * edge. once=false hides the content again when it leaves the viewport.
 *
 * The upstream `stagger` animates arbitrary slotted children, which live in
 * the page's style scope here — give each child its own ll-reveal delay.
 */
import { createComponent } from '../../common/component';
import { props } from './props';
import { renderLayers, hashSeed } from '../../common/ink';
import { bucketBox } from '../../common/ink-engine';

const EFFECTS = ['wipe', 'soak', 'drop', 'pop', 'toss'];
const NIB = { w: 24, h: 24 };

createComponent({
  options: { styleIsolation: 'isolated' },
  properties: props,
  data: {
    armed: false,
    visible: true,
    nibbed: false,
    nibStyle: '',
    stateClass: '',
  },
  observers: {
    'effect, from, delay, threshold, once'() {
      if (!this._st) return; // attached() arms the first time
      this.__rearm();
    },
  },
  lifetimes: {
    attached() {
      const d = this.data;
      const effect = EFFECTS.includes(d.effect) ? d.effect : 'wipe';
      this._st = {
        effect,
        threshold: Math.min(1, Math.max(0, Number(d.threshold) || 0.25)),
        once: d.once,
        io: null,
      };
      const nibbed = d.nib && effect === 'wipe';
      this.setData({ nibbed });
      if (nibbed) this.__renderNib(d.nibColor);
      this.__arm();
    },
    detached() {
      if (this._st && this._st.io) this._st.io.disconnect();
    },
  },
  methods: {
    __arm() {
      const st = this._st;
      if (st.io) {
        st.io.disconnect();
        st.io = null;
      }
      const io = wx.createIntersectionObserver(this, { thresholds: [0, st.threshold] });
      st.io = io;
      io.relativeToViewport().observe('.ll-reveal', (res) => {
        const enough = res && (res.intersectionRatio >= st.threshold || (res.intersectionRatio > 0 && res.boundingClientRect && res.boundingClientRect.height >= 0.4 * wx.getSystemInfoSync().windowHeight));
        if (enough) {
          if (!this.data.visible) {
            this.setData({ visible: true, stateClass: 'is-visible' });
            this.triggerEvent('reveal', {});
          }
          if (st.once && st.io) {
            st.io.disconnect();
            st.io = null;
          }
        } else if (!st.once && res && res.intersectionRatio === 0) {
          this.setData({ visible: false, stateClass: 'is-hidden' });
        }
      });
      this.setData({ armed: true, visible: false, stateClass: 'is-hidden' });
      // fallback: the observer's first tick can lag — if the box is already
      // on screen, reveal right away (guarded by the visible flag)
      this.createSelectorQuery()
        .select('.ll-reveal')
        .boundingClientRect((rect) => {
          if (!rect) return;
          const win = wx.getSystemInfoSync();
          const inView = rect.top < win.windowHeight * 0.98 && rect.bottom > win.windowHeight * 0.02;
          if (inView && !this.data.visible) {
            this.setData({ visible: true, stateClass: 'is-visible' });
            this.triggerEvent('reveal', {});
            if (st.once && st.io) {
              st.io.disconnect();
              st.io = null;
            }
          }
        })
        .exec();
    },
    __rearm() {
      const d = this.data;
      const st = this._st;
      const effect = EFFECTS.includes(d.effect) ? d.effect : 'wipe';
      st.effect = effect;
      st.threshold = Math.min(1, Math.max(0, Number(d.threshold) || 0.25));
      st.once = d.once;
      const nibbed = d.nib && effect === 'wipe';
      if (nibbed !== this.data.nibbed) {
        this.setData({ nibbed });
        if (nibbed) this.__renderNib(d.nibColor);
      }
      this.__arm();
    },
    __renderNib(color) {
      const e = renderLayers(
        'reveal-nib',
        bucketBox(NIB.w, NIB.h),
        { color },
        hashSeed('reveal-nib'),
      );
      if (!e.uris.rest) return;
      this.setData({
        nibStyle: `width:${NIB.w}px;height:${NIB.h}px;background-image:url("${e.uris.rest}");`,
      });
    },
    /** Replay (upstream remounts with a new key): hide, then let it arrive. */
    restart() {
      this.setData({ armed: false, visible: true, stateClass: '' });
      setTimeout(() => this.__arm(), 60);
    },
  },
});
