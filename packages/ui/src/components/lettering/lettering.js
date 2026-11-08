import { createComponent } from '../../common/component';
import { makeRng } from '../../common/rng';
import { hashSeed } from '../../common/ink';
import { props } from './props';

/** Upstream `Lettering` — a display title in the script font with a riso
    print look: ink with a second color printed a hair off register.
    Upstream draws the offset with text-shadow(calc(0.055em*k) …var(--ll-riso));
    calc+var inside text-shadow is exactly what the webview mangles (the D7
    skip note), so the port resolves the offsets to em literals (they scale
    with the font size on their own) and the tone to a hex in JS — same
    look, no calc, no var. The misregistration knob (calm density → 0)
    stays a global stylesheet concern the port does not wire; the print
    always sits at k = 1.

    wobble > 0 gives the line the Handwritten treatment (per-word seeded
    --jy/--jr/--jo, the same `hw|<seed>` chain — upstream delegates to
    Handwritten with the same strength/seed); text-shadow inherits onto
    the word spans. Words stay real text. */

const clamp = (v, m) => Math.max(-m, Math.min(m, v));

/** ToneName → riso ink. Hex literals mirror tokens.wxss (--ll-marker …);
    they are static, and inline vars inside text-shadow are the one thing
    the webview does not reliably paint. */
const RISO = {
  marker: '#df6b3c',
  tomato: '#e8483a',
  tangerine: '#f59a2f',
  lemon: '#fbd63a',
  grass: '#5db85c',
  teal: '#2fb1a3',
  sky: '#4aa8e8',
  grape: '#8f6fd6',
  bubblegum: '#f38bb8',
};

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    parts: [],
    plain: true,
    styleVars: '',
  },
  observers: {
    'text, wobble, seed'() {
      this.__split();
    },
    'tone, duotone'() {
      this.__applyPrint();
    },
  },
  lifetimes: {
    attached() {
      this.__split();
      this.__applyPrint();
    },
  },
  methods: {
    __applyPrint() {
      const d = this.data;
      const riso = RISO[d.tone] || RISO.marker;
      // The upstream offsets at misreg-k 1, in em so they ride the size.
      let shadow = `text-shadow:0.055em 0.045em 0 ${riso}`;
      if (d.duotone && RISO[d.duotone]) {
        shadow += `,-0.035em 0.07em 0 ${RISO[d.duotone]}`;
      }
      this.setData({ styleVars: shadow });
    },
    __split() {
      const d = this.data;
      const k = Math.max(0, Number(d.wobble) || 0);
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
