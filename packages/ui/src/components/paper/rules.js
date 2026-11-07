// Printed rules (upstream lib/ink/paper/stocks.ts ruleGeometry + rulesLayer) —
// pure CSS gradient layers under the content, above the sheet face. The
// upstream colors are color-mix(...) over tokens; the miniprogram webview
// can't parse that, so they are precomputed to rgba from common/tokens.
import { stockOf } from '../../common/ink-engine';
import TOKENS from '../../common/tokens';

function rgba(token, a) {
  const hex = TOKENS[`--ll-${token}`] || '#2a2420';
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

// upstream KALAM_BASELINE rule offset: aligns printed lines to the text
// baseline (no --ll-rule-offset var here — the offset is baked in).
const ruleOffsetFor = (pitch, fs = 17) => Math.round(pitch / 2 - 0.266 * fs - 1.95);

function geometry(kind, first) {
  switch (kind) {
    case 'ruled':
    case 'ruled-hand':
      return { kind, pitch: 28, first: first ?? 16 + 28, offset: ruleOffsetFor(28), margin: 44 };
    case 'pad':
      return { kind, pitch: 30, first: first ?? 40, offset: ruleOffsetFor(30) };
    case 'index':
      return { kind, pitch: 30, first: first ?? 49, offset: ruleOffsetFor(30) };
    case 'graph':
      return { kind, pitch: 16, first: 0, offset: 0, major: 64 };
    case 'dots':
      return { kind, pitch: 20, first: 10, offset: 0, major: 100 };
    case 'ledger':
      return { kind, pitch: 24, first: 40, offset: ruleOffsetFor(24, 15), cols: [54, 70] };
    case 'window':
      return { kind, pitch: 0, first: 0, offset: 0 };
    default:
      return null;
  }
}

const hline = (color, w = 0.9) =>
  `linear-gradient(to bottom, transparent calc(100% - ${w}px), ${color} calc(100% - ${w}px))`;
const vline = (color, x, w = 1.2) =>
  `linear-gradient(to right, transparent ${x - w / 2}px, ${color} ${x - w / 2}px ${x + w / 2}px, transparent ${x + w / 2}px)`;

/** CSS for one rules layer (absolute inset:0 view). 'ruled-hand' renders as
    'ruled' (upstream only draws the hand variant through the ink recipe —
    deferred; its calm fallback is the same ruled CSS). */
export function rulesStyle(kindName) {
  if (!kindName || kindName === 'none') return '';
  const kind = kindName === 'ruled-hand' ? 'ruled' : kindName;
  const geo = geometry(kind);
  if (!geo) return '';

  if (kind === 'window') {
    return (
      'left:10px;top:10px;right:10px;bottom:26%;' +
      `background-color:${rgba('paper-shade', 0.55)};` +
      `box-shadow:inset 0 2px 4px rgba(58,44,30,0.26),inset 0 0 0 1px rgba(58,44,30,0.1);`
    );
  }

  const images = [];
  const sizes = [];
  const positions = [];
  const repeats = [];
  const clips = [];
  const layer = (image, size, position, repeat, clip) => {
    images.push(image);
    sizes.push(size);
    positions.push(position || '0 0');
    repeats.push(repeat || 'no-repeat');
    clips.push(clip || 'border-box');
  };
  let paddingTop = '';
  const at = (y) => `${Math.max(0, y - geo.offset)}px`;

  if (kind === 'ruled' || kind === 'pad' || kind === 'index') {
    const rule = rgba(kind === 'pad' ? 'pad-rule' : 'rule-blue', kind === 'pad' ? 1 : 0.82);
    const red = rgba('rule-red', 0.88);
    if (geo.margin !== undefined) layer(vline(red, geo.margin), '100% 100%');
    if (kind === 'index') layer(hline(red, 1.2), `100% ${geo.first + 1}px`);
    const blueFirst = kind === 'index' ? geo.first + geo.pitch : geo.first;
    layer(hline(rule), `100% ${geo.pitch}px`, `0 ${at(blueFirst - geo.pitch + 1)}px`, 'repeat-y', 'content-box');
    paddingTop = `${at(Math.max(0, kind === 'index' ? geo.first + 2 : blueFirst - 1))}px`;
  } else if (kind === 'graph') {
    const fine = rgba('check-rule', 0.46);
    const bold = rgba('check-rule', 0.72);
    layer(`linear-gradient(to right, ${bold} 1px, transparent 1px)`, '64px 64px', '0 0', 'repeat');
    layer(`linear-gradient(to bottom, ${bold} 1px, transparent 1px)`, '64px 64px', '0 0', 'repeat');
    layer(`linear-gradient(to right, ${fine} 1px, transparent 1px)`, '16px 16px', '0 0', 'repeat');
    layer(`linear-gradient(to bottom, ${fine} 1px, transparent 1px)`, '16px 16px', '0 0', 'repeat');
  } else if (kind === 'dots') {
    layer(
      `radial-gradient(circle at center, ${rgba('pencil', 0.7)} 0 1.05px, transparent 1.5px)`,
      '100px 100px',
      '10px 10px',
      'repeat',
    );
    layer(
      `radial-gradient(circle at center, ${rgba('pencil-mark', 0.9)} 0 .8px, transparent 1.15px)`,
      '20px 20px',
      '10px 10px',
      'repeat',
    );
  } else {
    // ledger
    const line = rgba('check-rule', 0.62);
    const strong = rgba('check-rule', 1);
    const [qty, total] = geo.cols;
    layer(vline(strong, qty, 1), '100% 100%');
    layer(vline(strong, total, 1), '100% 100%');
    layer(hline(strong, 1.1), `100% ${at(40)}px`);
    layer(hline(line), `100% ${geo.pitch}px`, `0 ${at(40 - geo.pitch + 1)}px`, 'repeat-y', 'content-box');
    paddingTop = `${at(40)}px`;
  }

  // Upstream masks the lines with a hand-drawn opacity drift so they don't
  // read as ruled paper out of a laser printer.
  const drift =
    'linear-gradient(90deg, rgba(0,0,0,.86), rgba(0,0,0) 19%, rgba(0,0,0,.8) 47%, rgba(0,0,0,.96) 71%, rgba(0,0,0,.84))';
  return (
    `background-image:${images.join(',')};` +
    `background-size:${sizes.join(',')};` +
    `background-position:${positions.join(',')};` +
    `background-repeat:${repeats.join(',')};` +
    `background-clip:${clips.join(',')};` +
    (paddingTop ? `padding-top:${paddingTop};` : '') +
    `-webkit-mask-image:${drift};mask-image:${drift};`
  );
}

/** Default printed rules for a stock (upstream S.rules) — '' when none. */
export function stockRules(stockName) {
  const S = stockOf(stockName || 'paper');
  return S.rules && S.rules !== 'none' ? S.rules : '';
}
