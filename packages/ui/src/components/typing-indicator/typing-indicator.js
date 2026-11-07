import { createComponent } from '../../common/component';
import { props, validators } from './props';
import { typingGeometry } from '../../common/ink-engine';
import { renderLayers, hashSeed } from '../../common/ink';

/** Upstream animates the indicator with CSS selectors reaching into the
    inline SVG; a background-image data URI can't be reached from CSS, so —
    like ll-spinner's reveal — the animation is baked in as SMIL, mirroring
    upstream's ll-type-* keyframes (2s dots lap, 2.2s squiggle lap). */

/** Find `<g data-part="NAME" ...>` … its matching `</g>` (parts nest groups). */
function partRange(svg, name) {
  const start = svg.indexOf(`<g data-part="${name}"`);
  if (start < 0) return null;
  let depth = 0;
  const re = /<g\b|<\/g>/g;
  re.lastIndex = start;
  let m;
  while ((m = re.exec(svg))) {
    depth += m[0] === '</g>' ? -1 : 1;
    if (depth === 0) return { start, tagEnd: svg.indexOf('>', start) + 1, end: m.index + m[0].length };
  }
  return null;
}

/** A dot pops in on its beat: base opacity 0 (invisible before `begin`),
    then opacity 0→1 and scale .3→1.3→1 around its own center — upstream
    uses transform-box: fill-box, SMIL can't, so translate·scale·translate⁻¹. */
function popDot(svg, name, cx, cy, begin) {
  const p = partRange(svg, name);
  if (!p) return svg;
  const kt = '0;0.08;0.2;0.3;1';
  const dur = '2s';
  const openTag = svg.slice(p.start, p.tagEnd - 1); // '<g data-part="dot-1"'
  const repl =
    `${openTag} opacity="0">` +
    `<animate attributeName="opacity" values="0;0;1;1;1" keyTimes="${kt}" dur="${dur}" begin="${begin}s" repeatCount="indefinite"/>` +
    `<g transform="translate(${cx} ${cy})">` +
    `<g>` +
    `<animateTransform attributeName="transform" type="scale" values=".3;.3;1.3;1;1" keyTimes="${kt}" dur="${dur}" begin="${begin}s" repeatCount="indefinite" calcMode="linear"/>` +
    `<g transform="translate(${-cx} ${-cy})">` +
    svg.slice(p.tagEnd, p.end - 4) +
    `</g></g></g></g>`;
  return svg.slice(0, p.start) + repl + svg.slice(p.end);
}

/** The pencil keeps its own draw transform and rides in an outer group:
    hop (dots — two steps left) or walk (squiggle — one glide). */
function ridePencil(svg, span, variant) {
  const p = partRange(svg, 'pencil');
  if (!p) return svg;
  const values =
    variant === 'dots'
      ? `${-span} 0;${-span} 0;${-span / 2} 0;${-span / 2} 0;0 0;0 0`
      : `${-span} 0;${-span} 0;0 0;0 0`;
  const keyTimes = variant === 'dots' ? '0;0.1;0.3;0.4;0.48;1' : '0;0;0.8;1';
  const dur = variant === 'dots' ? '2s' : '2.2s';
  const repl =
    `<g><animateTransform attributeName="transform" type="translate" values="${values}" keyTimes="${keyTimes}" dur="${dur}" repeatCount="indefinite" calcMode="linear"/>` +
    svg.slice(p.start, p.end - 4) +
    `</g></g>`;
  return svg.slice(0, p.start) + repl + svg.slice(p.end);
}

/** The scrawl reveals left to right (an animated clipPath rect — the felt
    fill paths can't be dash-revealed), holds, then the lap restarts. */
function wipeLine(svg, w, h) {
  const p = partRange(svg, 'line');
  if (!p) return svg;
  const x = (w * -0.06).toFixed(1); // -6% like upstream's inset left
  const y = (-h * 0.2).toFixed(1);
  const full = (w * 1.06).toFixed(1); // 100% + 6%
  const clip =
    `<clipPath id="ll-wipe" clipPathUnits="userSpaceOnUse">` +
    `<rect x="${x}" y="${y}" height="${(h * 1.4).toFixed(1)}" width="0">` +
    `<animate attributeName="width" values="0;${full};${full}" keyTimes="0;0.8;1" dur="2.2s" repeatCount="indefinite" calcMode="linear"/>` +
    `</rect></clipPath>`;
  const repl =
    svg.slice(p.start, p.tagEnd) +
    clip +
    `<g clip-path="url(#ll-wipe)">` +
    svg.slice(p.tagEnd, p.end - 4) +
    `</g>` +
    svg.slice(p.end - 4, p.end);
  return svg.slice(0, p.start) + repl + svg.slice(p.end);
}

/** Upstream `TypingIndicator` — three felt dots (or a cursive scrawl) with
    Stubby's pencil, drawn by the typing-indicator recipe at its fixed size
    (56×24 dots, 80×24 squiggle) and animated with baked-in SMIL. `active`
    false keeps the box (and the sr-only label) but draws nothing. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    boxStyle: '',
    artStyle: '',
  },
  lifetimes: {
    attached() {
      this.__draw();
    },
  },
  observers: {
    'variant, pen, pencil, active, seed'() {
      this.__draw();
    },
  },
  methods: {
    __draw() {
      const d = this.data;
      const variant = validators.variant.includes(d.variant) ? d.variant : 'dots';
      const pen = validators.pen.includes(d.pen) ? d.pen : 'ink';
      const pencil = d.pencil === '' || d.pencil === true || d.pencil === 'true';
      const active = d.active === '' || d.active === true || d.active === 'true';
      const w = variant === 'dots' ? 56 : 80;
      const h = 24;
      const boxStyle = `width:${w}px;height:${h}px;`;
      if (!active) {
        this.setData({ boxStyle, artStyle: '' });
        return;
      }
      const seed = hashSeed(`typing-indicator:${variant}:${pen}:${pencil ? 1 : 0}:${d.seed || variant}`);
      const entry = renderLayers('typing-indicator', { w, h }, { variant, pen, pencil }, `${seed}`);
      if (!entry || !entry.uris.rest) {
        this.setData({ boxStyle, artStyle: '' });
        return;
      }
      let svg = decodeURIComponent(String(entry.uris.rest).replace(/^data:image\/svg\+xml[^,]*,/, ''));
      const g = typingGeometry(w, h, variant);
      if (variant === 'dots') {
        for (let i = 1; i <= 3; i++) {
          svg = popDot(svg, `dot-${i}`, g.xs[i - 1].toFixed(2), g.y.toFixed(2), ((i - 1) * 0.4).toFixed(1));
        }
      } else {
        svg = wipeLine(svg, w, h);
      }
      if (pencil) svg = ridePencil(svg, g.span, variant);
      const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      this.setData({
        boxStyle,
        artStyle: `inset:${-entry.pad}px;background-image:url("${uri}");`,
      });
    },
  },
});
