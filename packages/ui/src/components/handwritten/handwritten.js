import { createComponent } from '../../common/component';
import { makeRng } from '../../common/rng';
import { hashSeed } from '../../common/ink';
import { props } from './props';

/** Upstream `Handwritten` — every word sits a hair off the baseline and a
    touch lighter, by a seeded amount (per-word fork(n) of `hw|<seed>`).
    Words stay inline text spans with real spaces between them; each
    carries --jy (baseline offset) / --jr (rotation, kept for stylesheets)
    / --jo (ink lightness). Strength 0 renders plain text. */

const clamp = (v, m) => Math.max(-m, Math.min(m, v));

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    parts: [],
    plain: false,
  },
  observers: {
    'text, strength, seed'() {
      this.__split();
    },
  },
  lifetimes: {
    attached() {
      this.__split();
    },
  },
  methods: {
    __split() {
      const d = this.data;
      const k = Math.max(0, Number(d.strength) || 0);
      const s = String(d.text ?? '');
      if (!s || k === 0) {
        this.setData({ parts: [], plain: true });
        return;
      }
      const rng = makeRng(`hw|${hashSeed(`${d.seed ?? ''}`)}`);
      let n = 0;
      const parts = [];
      for (const part of s.split(/(\s+)/)) {
        if (part === '') continue;
        if (/^\s+$/.test(part)) {
          parts.push({ sp: part });
          continue;
        }
        const r = rng.fork(n++);
        parts.push({
          w: part,
          s:
            `--jy:${clamp(r.gauss(0, 0.55) * 1.5 * k, 1.6).toFixed(2)}px;` +
            `--jr:${clamp(r.gauss(0, 0.6) * 1.4 * k, 1.7).toFixed(2)}deg;` +
            `--jo:${(1 - r.range(0, 0.12) * k).toFixed(2)};`,
        });
      }
      this.setData({ parts, plain: false });
    },
  },
});
