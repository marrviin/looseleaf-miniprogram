import { createComponent } from '../../common/component';
import { props } from './props';
import {
  normaliseLang,
  langFromFileName,
  tokenizeLines,
  parseDiff,
  diffResult,
  diffStats,
} from '../../common/code-highlight';
import { makeRng } from '../../common/rng';

/** Upstream `CodeBlock` — a slip of paper with the code tokenized by the
    tiny hand-rolled highlighter (common/code-highlight.js). The header's
    dashed pencil rule comes from the code-block-rule recipe; the body's
    focus ring recipe is omitted (no keyboard focus in the webview). Diff
    mode renders Strike/Tick doodles per line, drawn as data-URI SVGs. */

function strikeSvg(seed) {
  const r = makeRng(seed);
  const y = (v) => (4 + v + r.gauss(0, 0.35)).toFixed(2);
  const a = `M0 ${y(0.1)} C24 ${y(-0.8)} 44 ${y(0.9)} 66 ${y(-0.2)} S92 ${y(0.6)} 100 ${y(-0.4)}`;
  const b = `M2 ${y(1.1)} C30 ${y(0.4)} 58 ${y(1.6)} 98 ${y(0.9)}`;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 8' preserveAspectRatio='none'>` +
    `<path d='${b}' fill='none' stroke='#c2412d' stroke-width='1' stroke-linecap='round' opacity='0.5' vector-effect='non-scaling-stroke'/>` +
    `<path d='${a}' fill='none' stroke='#c2412d' stroke-width='1.7' stroke-linecap='round' vector-effect='non-scaling-stroke'/>` +
    `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function tickSvg(seed) {
  const r = makeRng(seed);
  const j = () => r.gauss(0, 0.5);
  const d = `M${(1.6 + j()).toFixed(2)} ${(7.4 + j()).toFixed(2)} L${(5.1 + j()).toFixed(2)} ${(11.4 + j()).toFixed(2)} L${(12.6 + j()).toFixed(2)} ${(2.2 + j()).toFixed(2)}`;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'>` +
    `<path d='${d}' fill='none' stroke='#3b7a4b' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'/>` +
    `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** Tokens render as text nodes — collapse-proof the indentation by turning
    spaces into no-break spaces (wrap mode still breaks via overflow-wrap). */
function hardSpaces(tokens) {
  return tokens.map((t) => ({ type: t.type, text: t.text.replace(/ /g, ' ') }));
}

function buildModel(code, language, filename, diffProp, startLine) {
  const lang = language ? normaliseLang(language) : filename ? langFromFileName(filename) : 'text';
  const isDiff = diffProp === null ? lang === 'diff' : !!diffProp;
  const n0 = Number(startLine) || 1;
  let lines;
  let text;
  let stats;
  if (isDiff) {
    const rows = parseDiff(code);
    const tokens = tokenizeLines(rows.map((r) => r.text).join('\n'), lang === 'diff' ? 'text' : lang);
    let n = n0;
    lines = rows.map((r, i) => ({
      kind: r.kind,
      n: r.kind === 'del' || r.kind === 'meta' ? null : n++,
      tokens: hardSpaces(tokens[i] || []),
    }));
    text = diffResult(rows);
    stats = diffStats(rows);
  } else {
    text = code.endsWith('\n') ? code.slice(0, -1) : code;
    const tokens = tokenizeLines(text, lang);
    lines = tokens.map((t, i) => ({ kind: 'plain', n: n0 + i, tokens: hardSpaces(t) }));
    stats = null;
  }
  return { lang, isDiff, lines, text, stats };
}

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    lang: 'text',
    isDiff: false,
    isDark: true,
    lines: [],
    text: '',
    stats: null,
    headerLabel: '',
    copyLabel: 'copy',
    copyIcon: 'copy',
    llInkRecipe: 'code-block-rule',
    llInkSelector: '.ll-code-block-header',
  },
  observers: {
    'code, language, filename, diff, startLine, lineNumbers, seed'(code, language, filename, diff, startLine, lineNumbers, seed) {
      const s = String(seed || filename || 'code-block');
      const m = buildModel(code || '', language, filename, diff, startLine);
      const lines = m.lines.map((l, i) => {
        const add = l.kind === 'add';
        const del = l.kind === 'del';
        // Upstream dims every 7th/11th row a touch, for a printed feel.
        const dim = (i + 1) % 7 === 3 ? 0.94 : (i + 1) % 11 === 6 ? 0.9 : 1;
        return {
          kind: l.kind,
          num: lineNumbers && l.n !== null ? l.n : null,
          add,
          del,
          meta: l.kind === 'meta',
          dim,
          tokens: l.tokens,
          tick: add ? tickSvg(`${s}|t${i}`) : '',
          strike: del ? strikeSvg(`${s}|s${i}`) : '',
        };
      });
      this.setData({
        lang: m.lang,
        isDiff: m.isDiff,
        isDark: this.data.tone !== 'paper',
        lines,
        text: m.text,
        stats: m.stats,
        headerLabel: filename || m.lang,
      });
    },
  },
  methods: {
    onCopy() {
      wx.setClipboardData({
        data: this.data.text,
        success: () => {
          this.setData({ copyLabel: 'copied', copyIcon: 'check' });
          clearTimeout(this.__copyTimer);
          this.__copyTimer = setTimeout(() => this.setData({ copyLabel: 'copy', copyIcon: 'copy' }), 1800);
        },
      });
    },
  },
});
