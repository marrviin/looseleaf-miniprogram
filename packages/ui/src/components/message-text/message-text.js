import { createComponent } from '../../common/component';
import { hashSeed } from '../../common/ink';
import { props } from './props';

/** Upstream `MessageText` — one span per word with a hair of baseline offset
    and a shade of lighter ink; while streaming, words past the first render
    soak in (a 0.5s CSS animation) and a felt-tip caret rides the last word. */

const jitterOf = (seed, index) => {
  const h = hashSeed(`${seed}:${index}`);
  const jy = (((h % 1000) / 1000) * 2 - 1) * 0.6;
  const jo = 0.88 + (((h >> 10) % 1000) / 1000) * 0.12;
  return `top:${jy.toFixed(2)}px;opacity:${jo.toFixed(2)}`;
};

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    words: [],
  },
  observers: {
    'text, streaming, jitter, seed'() {
      this.__setWords();
    },
  },
  lifetimes: {
    attached() {
      // Words present at the first render are "settled" — never soaked.
      this.__settled = (this.data.text || '').trim().split(/\s+/).filter(Boolean).length;
      this.__setWords();
    },
  },
  methods: {
    __setWords() {
      const d = this.data;
      const text = d.text || '';
      const parts = text.split(/(\s+)/);
      const words = [];
      let word = 0;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (p === '') continue;
        if (/^\s+$/.test(p)) {
          words.push({ key: i, sp: true, t: p });
          continue;
        }
        const n = word++;
        words.push({
          key: i,
          sp: false,
          t: p,
          soak: d.streaming && n >= this.__settled,
          caret: d.streaming && this.__isLastWord(i, parts),
          style: d.jitter ? jitterOf(`${d.seed || 'words'}`, n) : '',
        });
      }
      this.setData({ words });
    },
    __isLastWord(i, parts) {
      for (let j = parts.length - 1; j > i; j--) {
        if (parts[j] && !/^\s+$/.test(parts[j])) return false;
      }
      return true;
    },
  },
});
