import { createComponent } from '../../common/component';
import { props } from './props';
import { drawSkeleton } from '../../common/ink-engine';
import { resolvePaint } from '../../common/ink';

/** Upstream MARKS (asterisk.tsx) — the four footnote glyphs as inline
    ArtDefs (kind icon, grid 24). */
const MARKS = {
  asterisk: {
    kind: 'icon',
    grid: 24,
    parts: [
      ['s', 'M12.3 3.6 L11.7 20.4', 1.3],
      ['s', 'M4.4 7.9 L19.6 16.3', 1.3],
      ['s', 'M19.1 7.5 L5.2 16.6', 1.3],
    ],
    small: [
      ['s', 'M12.4 3 L11.6 21', 1.1],
      ['s', 'M3.5 7.4 L20.3 16.8', 1.1],
      ['s', 'M20 7 L4.4 17', 1.1],
    ],
  },
  star: {
    kind: 'icon',
    grid: 24,
    parts: [['s', 'M12.2 3.1 L14.8 9.3 L21.3 9.9 L16.4 14.3 L17.9 20.7 L12.1 17.3 L6.3 20.8 L7.7 14.3 L2.8 9.8 L9.4 9.3 L12.5 3.9', 1.15]],
    small: [['s', 'M12.2 2.6 L15 9 L21.6 9.7 L16.7 14.2 L18.2 21 L12.1 17.5 L5.9 21.1 L7.4 14.2 L2.4 9.6 L9.2 9 L12.6 3.4', 1.05]],
  },
  dagger: {
    kind: 'icon',
    grid: 24,
    parts: [
      ['s', 'M12.1 2.9 L11.8 21.3', 1.3],
      ['s', 'M7.7 8.3 L16.4 7.8', 1.3],
    ],
    small: [
      ['s', 'M12.2 2.4 L11.8 21.8', 1.15],
      ['s', 'M6.9 8.4 L17.2 7.9', 1.15],
    ],
  },
  'double-dagger': {
    kind: 'icon',
    grid: 24,
    parts: [
      ['s', 'M12.1 2.9 L11.8 21.3', 1.3],
      ['s', 'M7.7 7.6 L16.4 7.2', 1.3],
      ['s', 'M8.1 13.9 L15.9 14.3', 1.3],
    ],
    small: [
      ['s', 'M12.2 2.4 L11.8 21.8', 1.15],
      ['s', 'M6.9 7.6 L17.2 7.1', 1.15],
      ['s', 'M7.4 14.2 L16.8 14.6', 1.15],
    ],
  },
};

/** Upstream TONES — the paint is baked into the data URI (a background
    image can't inherit the text color). */
const TONES = {
  red: 'var(--ll-red, #c2412d)',
  ink: 'var(--ll-ink, #2a2420)',
  blue: 'var(--ll-ink-you, #2c4f9e)',
  pencil: 'var(--ll-pencil-text, #5a554e)',
};

const CACHE = new Map();

/** Upstream `Asterisk` — drawSkeleton on the inline MARKS ArtDefs (no
    recipe pipeline), drawn at 16px and displayed at 0.8em aligned 0.4em
    like upstream's size-[0.8em] align-[0.4em] svg. Upstream's href link
    variant has no miniprogram equivalent (no in-page anchors); the label
    still names the glyph for accessibility. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    glyphStyle: '',
  },
  lifetimes: {
    attached() {
      this.__draw();
    },
  },
  observers: {
    'mark, tone, seed'() {
      this.__draw();
    },
  },
  methods: {
    __draw() {
      const d = this.data;
      const def = MARKS[d.mark] || MARKS.asterisk;
      const key = `asterisk|${d.mark}|${d.seed || ''}`;
      let res = CACHE.get(key);
      if (!res) {
        res = drawSkeleton(def, 16, d.seed || d.mark, { tone: 'ui', kind: 'icon' });
        if (CACHE.size > 300) CACHE.clear();
        CACHE.set(key, res);
      }
      const color = TONES[d.tone] || TONES.red;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-res.pad} ${-res.pad} ${res.w + res.pad * 2} ${res.h + res.pad * 2}">${resolvePaint(res.svg, color)}</svg>`;
      this.setData({
        glyphStyle: `background-image:url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}");`,
      });
    },
  },
});
