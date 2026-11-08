/**
 * ll-signature-pad — upstream SignaturePad (signature-pad.tsx).
 *
 * The composition parts fold into one component: an ll-sketchpad (single pen,
 * no toolbar, slip stock + hair shadow) with the Guides layered on top —
 * the baseline rule (signature-baseline recipe, red when invalid), the typed
 * hand-lettering in type mode, an externally-set value image, and the
 * "Sign here" placeholder — then the typed-name input and the Clear /
 * "Type instead" row.
 *
 * The published value is an SVG data URL: draw mode composites the strokes
 * (strokesToSvg, margin 6), type mode renders the name as hand lettering
 * with a brush swash (typedSignature). Upstream's hidden form input doesn't
 * port (no native form validity) — the page owns validation and passes
 * `invalid`; format 'png' (canvas rasterization) is svg-only here.
 */
import { createComponent } from '../../common/component';
import { props } from './props';
import { renderLayers, hashSeed, resolvePaint } from '../../common/ink';
import { bucketBox, strokesToSvg, typedSignature, svgDataUrl } from '../../common/ink-engine';

const PAD = 6; // margin around the composed signature (upstream compose)

createComponent({
  options: { styleIsolation: 'isolated' },
  properties: props,
  data: {
    mode: 'draw',
    typedStr: '',
    padStrokes: [],
    canClear: false,
    baselineStyle: '',
    overlayStyle: '',
    placeholder: false,
    placeholderText: 'Sign here',
    invalidNow: false,
    typedFocus: false,
    penSize: 0.95,
  },
  observers: {
    // controlled value: when it isn't our own emission, adopt it — the local
    // strokes/typed reset and the image shows over the baseline (upstream's
    // valueProp effect + Guides value <img>).
    value(next) {
      const st = this._st;
      if (!st || next == null || next === st.published) return;
      st.published = next;
      st.strokes = [];
      st.typed = '';
      this.__syncInput();
    },
    mode(next) {
      if (!this._st || next == null || next === this._st.mode) return;
      this._st.mode = next;
      this.setData({ mode: next });
      this.__publish();
    },
    invalid(next) {
      if (this._st) {
        this._st.invalid = !!next;
        this.setData({ invalidNow: !!next });
        this.__renderBaseline();
      }
    },
  },
  lifetimes: {
    attached() {
      const d = this.data;
      const W = Math.max(80, Number(d.width) || 480);
      const H = Math.max(80, Number(d.height) || 180);
      this._st = {
        W,
        H,
        strokes: [],
        typed: '',
        mode: d.mode != null ? d.mode : d.defaultMode,
        published: d.value != null ? d.value : d.defaultValue,
        controlled: d.value != null,
        invalid: d.invalid,
        seed: `sig|${Math.random().toString(36).slice(2, 8)}${d.seed || ''}`,
        penColor: d.penColor,
        box: null,
      };
      this.setData({
        mode: this._st.mode,
        invalidNow: !!d.invalid,
        penSize: d.pen === 'brush' ? 0.95 : 1.2,
        placeholderText: this._st.mode === 'type' ? 'Type your name below' : 'Sign here',
        typedFocus: this._st.mode === 'type',
      });
      this.__syncInput();
      this.__measure();
    },
  },
  methods: {
    // ---- measurement & layers ---------------------------------------------
    __measure() {
      this.createSelectorQuery()
        .select('.ll-signature-canvas')
        .boundingClientRect((rect) => {
          if (!rect || !rect.width) {
            setTimeout(() => this.__measure(), 120);
            return;
          }
          const st = this._st;
          st.box = { w: rect.width, h: (rect.width * st.H) / st.W };
          this.__renderBaseline();
        })
        .exec();
    },
    __renderBaseline() {
      const st = this._st;
      if (!st.box) return;
      const e = renderLayers(
        'signature-baseline',
        bucketBox(st.box.w, st.box.h),
        { invalid: st.invalid },
        hashSeed(`${st.seed}|line`),
      );
      const uri = e.uris.rest;
      this.setData({
        baselineStyle: uri
          ? `inset:-${e.pad}px;background-image:url("${uri}");`
          : '',
      });
    },
    // ---- composing & publishing -------------------------------------------
    __resolve(n) {
      return resolvePaint(`var(${n})`);
    },
    __compose(mode, strokes, typed) {
      const st = this._st;
      let svg = '';
      if (mode === 'draw' && strokes.length) {
        svg = strokesToSvg(strokes, {
          width: st.W,
          height: st.H,
          margin: PAD,
          title: 'Signature',
          resolve: (n) => this.__resolve(n),
        });
      } else if (mode === 'type' && typed.trim()) {
        const sig = typedSignature(typed.trim().slice(0, 60), st.W, st.H, st.seed, st.penColor);
        if (sig.svg) {
          svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-PAD} ${-PAD} ${st.W + 2 * PAD} ${st.H + 2 * PAD}" width="${st.W + 2 * PAD}" height="${st.H + 2 * PAD}" role="img"><title>Signature</title>${sig.svg}</svg>`;
          svg = svg.replace(/var\((--ll-[a-z0-9-]+)\)/g, (whole, n) => this.__resolve(n) || whole);
        }
      }
      return svg ? svgDataUrl(svg) : '';
    },
    __publish() {
      const st = this._st;
      const value = st.controlled ? st.published : this.__compose(st.mode, st.strokes, st.typed);
      if (!st.controlled) st.published = value;
      const canClear = st.mode === 'type' ? !!st.typed.trim() : st.strokes.length > 0;
      const showValue = value && !st.strokes.length && !st.typed.trim();
      let overlayStyle = '';
      if (st.mode === 'type' && st.typed.trim()) {
        const uri = this.__compose('type', st.strokes, st.typed);
        if (uri) overlayStyle = `inset:${-PAD}px;background-size:100% 100%;background-image:url("${uri}");`;
      } else if (showValue) {
        overlayStyle = `inset:0;background-size:100% 100%;background-image:url("${value}");`;
      }
      this.setData({
        canClear,
        overlayStyle,
        placeholder: !value && !st.strokes.length && !st.typed.trim(),
        invalidNow: st.invalid,
      });
      this.triggerEvent('change', { value, mode: st.mode, strokes: st.strokes, text: st.typed });
    },
    __syncInput() {
      const st = this._st;
      this.setData({
        typedStr: st.typed,
        padStrokes: st.strokes.slice(),
      });
      this.__publish();
    },
    // ---- interactions -------------------------------------------------------
    onPadChange(e) {
      const st = this._st;
      st.strokes = (e.detail && e.detail.strokes) || [];
      this.__publish();
    },
    onTyped(e) {
      const st = this._st;
      st.typed = e.detail.value || '';
      this.__publish();
    },
    onToggleMode() {
      const st = this._st;
      if (this.data.readOnly || this.data.disabled) return;
      const next = st.mode === 'type' ? 'draw' : 'type';
      st.mode = next;
      this.setData({
        mode: next,
        placeholderText: next === 'type' ? 'Type your name below' : 'Sign here',
        typedFocus: next === 'type',
      });
      this.triggerEvent('modechange', { mode: next });
      this.__publish();
    },
    onClear() {
      const st = this._st;
      if (this.data.disabled || this.data.readOnly) return;
      if (st.mode === 'type') {
        if (!st.typed) return;
        st.typed = '';
      } else {
        if (!st.strokes.length) return;
        st.strokes = [];
      }
      this.setData({ typedFocus: st.mode === 'type' });
      this.__syncInput();
    },

    // ---- public API ---------------------------------------------------------
    clear() {
      this.onClear();
    },
    signature() {
      return this._st.published;
    },
  },
});
