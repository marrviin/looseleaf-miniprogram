/**
 * ll-flip-card — upstream FlipCard (flip-card.tsx) + flip-card-ink.ts.
 *
 * A 3D turn between two paper faces: the inner wrapper carries
 * preserve-3d and rotates 180° around x or y; each face hides its
 * backface, the back one pre-rotated. Tapping the overlay (or calling
 * toggle()) turns it; the corner arrow hint is the flip-card-trigger
 * recipe drawn over the whole card. Faces are the named slots front/back,
 * each wrapped in its own ll-paper (front index-card, back slip by
 * default — the upstream Face defaults).
 */
import { createComponent } from '../../common/component';
import { props } from './props';
import { renderLayers, hashSeed } from '../../common/ink';
import { bucketBox } from '../../common/ink-engine';

createComponent({
  options: { styleIsolation: 'isolated', multipleSlots: true },
  properties: props,
  data: {
    flippedNow: false,
    touched: false,
    hintStyle: '',
  },
  observers: {
    flipped(p) {
      if (p === null || p === undefined) return;
      this.setData({ flippedNow: !!p });
    },
    'hint, seed'() {
      if (!this._st) return;
      this.__renderHint();
    },
  },
  lifetimes: {
    attached() {
      const d = this.data;
      this._st = { seed: `${d.seed || ''}` };
      this.setData({ flippedNow: d.flipped !== null && d.flipped !== undefined ? !!d.flipped : !!d.defaultFlipped });
      this.__renderHint();
    },
  },
  methods: {
    __renderHint() {
      const st = this._st;
      const d = this.data;
      this.createSelectorQuery()
        .select('.ll-flip-card')
        .boundingClientRect((rect) => {
          if (!rect || !(rect.width > 0)) return;
          const w = Math.round(rect.width);
          const h = Math.round(rect.height);
          const e = renderLayers(
            'flip-card-trigger',
            bucketBox(w, h),
            { hint: d.hint },
            hashSeed(`${st.seed}|flip`),
          );
          if (!e.uris.rest) return;
          this.setData({
            hintStyle: `background-image:url("${e.uris.rest}");`,
          });
        })
        .exec();
    },
    onToggle() {
      const next = !this.data.flippedNow;
      if (this.data.flipped === null || this.data.flipped === undefined) {
        this.setData({ flippedNow: next, touched: true });
      }
      this.triggerEvent('flippedchange', { flipped: next });
    },
    /** Turn it over from the page (upstream: the trigger asChild). */
    toggle() {
      this.onToggle();
    },
  },
});
