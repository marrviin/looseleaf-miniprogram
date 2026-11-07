import { createComponent } from '../../common/component';
import { renderLayers, hashSeed } from '../../common/ink';
import { bucketBox } from '../../common/ink-engine';
import { props } from './props';

/** Upstream `Progress` — a pencil-hatched box (progress recipe on the root)
    with a full-length marker pass (progress-fill recipe) revealed by a CSS
    clip-path up to the value, so a value change is a transition, not a
    redraw. Without a number the clip animates across (indeterminate). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'progress',
    llInkSelector: '.ll-progress',
    indeterminate: false,
    fillStyle: '',
  },
  observers: {
    value() {
      const was = this.data.indeterminate;
      this.__syncFill();
      // indeterminate toggles the fill drawing (band → scribble)
      if (was !== this.data.indeterminate) setTimeout(() => this.__renderFill(), 0);
    },
    'max, tone'() {
      this.__syncFill();
      setTimeout(() => this.__renderFill(), 0);
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({});
      this.__syncFill();
      setTimeout(() => this.__renderFill(), 50);
      setTimeout(() => this.__renderFill(), 300);
    },
  },
  methods: {
    /** The fill ink is drawn once at the measured box; the value only moves
        the clip window (upstream: --ll-progress + a clip-path calc). */
    __renderFill() {
      const d = this.data;
      this.createSelectorQuery()
        .select('.ll-progress')
        .boundingClientRect((rect) => {
          if (!rect || !rect.width) return;
          const seed = `${hashSeed(`progress-fill|${d.seed ?? ''}|${Math.round(rect.width)}x${Math.round(rect.height)}`)}`;
          const entry = renderLayers(
            'progress-fill',
            bucketBox(rect.width, rect.height),
            { tone: d.tone || 'marker', indeterminate: d.indeterminate },
            seed
          );
          if (!entry || !entry.uris.rest) return;
          this.setData({ fillStyle: `inset:${-entry.pad}px;background-image:url("${entry.uris.rest}")` });
        })
        .exec();
    },
    __syncFill() {
      const d = this.data;
      const max = Number(d.max) > 0 ? Number(d.max) : 100;
      const v = d.value;
      const indeterminate = typeof v !== 'number' || Number.isNaN(v);
      const pct = indeterminate ? 0 : Math.min(max, Math.max(0, v)) / max * 100;
      this.setData({
        indeterminate,
        // right inset grows with the value; the -12px lets the ink bleed
        fillClip: indeterminate
          ? 'clip-path:inset(-12px 30% -12px 30%);'
          : `clip-path:inset(-12px calc(100% - ${pct}%) -12px 0);`,
        now: indeterminate ? null : Math.min(max, Math.max(0, v)),
      });
    },
  },
});
