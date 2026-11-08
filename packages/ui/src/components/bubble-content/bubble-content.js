import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `BubbleContent` — the drawn body. Cloud shapes draw the
    bubbleRecipe round the text; note/sticky shapes are a Paper. The tail is
    part of the same SVG (upstream hides it with CSS), so non-last group
    bubbles strip the balanced `<g data-part="tail">` out of the data URI. */
const URI_PREFIX = 'url("data:image/svg+xml;charset=utf-8,';

function stripTailGroup(styleStr) {
  const start = styleStr.indexOf(URI_PREFIX);
  if (start === -1) return styleStr;
  const payloadStart = start + URI_PREFIX.length;
  const end = styleStr.indexOf('")', payloadStart);
  if (end === -1) return styleStr;
  let svg;
  try {
    svg = decodeURIComponent(styleStr.slice(payloadStart, end));
  } catch {
    return styleStr;
  }
  const mark = svg.indexOf('<g data-part="tail">');
  if (mark === -1) return styleStr;
  // Balanced <g> scan (recipes emit well-formed nesting).
  let depth = 0;
  let i = mark;
  let out = svg.slice(0, mark);
  while (i < svg.length) {
    const open = svg.indexOf('<g', i);
    const close = svg.indexOf('</g>', i);
    if (close === -1) break;
    if (open !== -1 && open < close) {
      depth += 1;
      i = open + 2;
    } else {
      depth -= 1;
      i = close + 4;
      if (depth === 0) break;
    }
  }
  const stripped = out + svg.slice(i);
  return styleStr.slice(0, payloadStart) + encodeURIComponent(stripped) + styleStr.slice(end);
}

const NOTE_STOCK = {
  default: 'slip',
  secondary: 'index-card',
  muted: 'paper',
  tinted: 'card',
  outline: 'graph',
  ghost: 'slip',
  destructive: 'slip',
};
const STICKY_STOCK = {
  default: 'sticky-orange',
  secondary: 'sticky-yellow',
  muted: 'sticky-blue',
  tinted: 'sticky-pink',
  outline: 'sticky-green',
  ghost: 'sticky-yellow',
  destructive: 'sticky-pink',
};
const TEXT_COLOR = {
  default: 'var(--ll-paper, #f8f5ee)',
  secondary: 'var(--secondary-foreground, #2a2420)',
  muted: 'var(--ll-foreground, #2a2420)',
  tinted: 'var(--ll-foreground, #2a2420)',
  outline: 'var(--ll-foreground, #2a2420)',
  ghost: 'var(--ll-foreground, #2a2420)',
  destructive: 'var(--ll-paper, #f8f5ee)',
};

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    // Set once a cloud shape with a drawn variant asks for ink ('' keeps
    // attachInk idle for ghost and the paper shapes).
    llInkRecipe: '',
    llInkSelector: '.ll-bubble-content',
    inkStyleDrawn: '',
    isCloud: true,
    isSheet: false,
    isNote: false,
    variant: 'default',
    penName: 'ink',
    textColor: '',
    styleColor: '',
    sheetStock: 'slip',
    paperTilt: null,
    paperFastener: '',
    paperSeed: '',
  },
  relations: {
    '../bubble/bubble': {
      type: 'ancestor',
    },
  },
  observers: {
    inkStyle() {
      this.__applyDrawn();
    },
  },
  methods: {
    /** Derive the drawn style (tail stripped when the group says so) into a
        separate key — never write inkStyle back (observer wedge). */
    __applyDrawn() {
      const src = this.data.inkStyle;
      const drawn = this.__tailOn === false ? stripTailGroup(src) : src;
      if (drawn !== this.data.inkStyleDrawn) this.setData({ inkStyleDrawn: drawn });
    },
    /** From the Bubble: the state this content draws from. */
    __onBubble({ variant, align, shape, pen, tailOn }) {
      this.__tailOn = tailOn;
      const sheet = shape !== 'cloud';
      const drawn = shape === 'cloud' && variant !== 'ghost';
      const paper = this.data.paper || {};
      // Clouds color the text by variant (white on the blue fills); sheets
      // always read as ink on paper (upstream `text-ink`), pen="you" keeps
      // the blue felt in both.
      const cloudColor = TEXT_COLOR[variant] || '#2a2420';
      const color = pen === 'you' ? 'var(--ll-ink-you, #2c4f9e)' : sheet ? 'var(--ll-foreground, #2a2420)' : cloudColor;
      const patch = {
        isCloud: !sheet,
        isSheet: sheet,
        isNote: shape === 'note',
        variant,
        penName: pen,
        textColor: color,
        styleColor: `color:${color};`,
        sheetStock: sheet ? (shape === 'sticky' ? STICKY_STOCK[variant] : NOTE_STOCK[variant]) : '',
        paperTilt: paper.tilt != null ? paper.tilt : null,
        paperFastener: paper.fastener || '',
        paperSeed: `${this.data.seed || paper.seed || ''}`,
      };
      const params = { variant, tail: align, pen, interactive: !!this.data.interactive };
      const paramsChanged = JSON.stringify(params) !== JSON.stringify(this.__inkParams);
      if (drawn) {
        patch.llInkRecipe = 'bubble';
        if (paramsChanged || !this.__inkParams) this.__inkParams = params;
      } else if (this.data.llInkRecipe) {
        patch.llInkRecipe = '';
        patch.inkStyle = '';
        patch.inkStyleDrawn = '';
      }
      this.setData(patch);
      this.__inkParams = drawn ? params : undefined;
      if (drawn) {
        setTimeout(() => {
          this.__measureInk && this.__measureInk();
          this.__applyDrawn();
        }, 0);
      }
    },
  },
});
