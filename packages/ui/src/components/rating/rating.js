import { createComponent } from '../../common/component';
import { renderLayers, hashSeed } from '../../common/ink';
import { bucketBox } from '../../common/ink-engine';
import { props } from './props';

/** Upstream `Rating` — a radio group of hand-drawn glyphs (rating recipe,
    one drawing per glyph at a fixed box, seed `seed:index`). Shown state per
    glyph: checked (value ≥ index), indeterminate (allowHalf, ≥ index−0.5) or
    rest; the on-state layer stacks over the pencil rest like upstream's
    one-SVG model. Upstream's hover preview and keyboard model have no
    touch equivalent here — taps pick a glyph (or half) directly. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    items: [], // per-glyph: { style, v1, v2, c1, c2 }
    ro: false,
    roLabel: '',
  },
  observers: {
    value(v) {
      if (v === null || v === undefined) return; // uncontrolled — keep internal
      const next = this.__snap(Number(v));
      if (next !== this.__current) {
        this.__current = next;
        this.__sync();
      } else {
        this.__sync();
      }
    },
    'max, allowHalf'() {
      setTimeout(() => this.__render(), 0);
    },
    'disabled, invalid, icon, size'() {
      setTimeout(() => this.__render(), 0);
    },
  },
  lifetimes: {
    attached() {
      this.__current = this.__snap(
        this.data.value != null ? Number(this.data.value) : Number(this.data.defaultValue) || 0,
      );
      this.__render();
    },
  },
  methods: {
    __max() {
      return Math.max(1, Math.round(Number(this.data.max) || 5));
    },
    __snap(v) {
      const step = this.data.allowHalf ? 0.5 : 1;
      return Math.min(this.__max(), Math.max(0, Math.round(v / step) * step));
    },
    __px() {
      const s = this.data.size;
      return s === 'sm' ? 20 : s === 'lg' ? 32 : 24;
    },
    /** One drawing per glyph at its fixed box (pad keeps the overhang). */
    __render() {
      const d = this.data;
      const max = this.__max();
      const box = bucketBox(this.__px(), this.__px());
      const params = { icon: d.icon, disabled: !!d.disabled, invalid: d.invalid && !d.disabled };
      this.__entries = [];
      for (let i = 1; i <= max; i++) {
        this.__entries.push(renderLayers('rating', box, params, hashSeed(`rating:${d.seed ?? ''}:${i}`)));
      }
      this.__sync();
    },
    __sync() {
      const d = this.data;
      if (!this.__entries) return;
      const items = [];
      for (let i = 1; i <= this.__entries.length; i++) {
        const entry = this.__entries[i - 1];
        const state = this.__current >= i ? 'checked' : d.allowHalf && this.__current >= i - 0.5 ? 'indeterminate' : 'unchecked';
        const stack = [];
        if (state === 'indeterminate' && entry.uris.indeterminate) stack.push(entry.uris.indeterminate);
        else if (state === 'checked' && entry.uris.checked) stack.push(entry.uris.checked);
        stack.push(entry.uris.rest ?? '');
        items.push({
          style: `inset:${-entry.pad}px;background-image:${stack.map((u) => `url("${u}")`).join(',')}`,
          v1: i - 0.5,
          v2: i,
          c1: d.allowHalf ? this.__current === i - 0.5 : this.__current === i,
          c2: this.__current === i,
        });
      }
      this.setData({
        items,
        ro: !!d.readOnly,
        roLabel: d.ariaLabel || `Rated ${this.__current} out of ${this.__entries.length}`,
      });
    },
    onHit(e) {
      const d = this.data;
      if (d.disabled || d.readOnly) return;
      const v = Number(e.currentTarget.dataset.v);
      const next = d.clearable && v === this.__current ? 0 : this.__snap(v);
      if (next === this.__current) return;
      this.__current = next;
      this.__sync();
      this.triggerEvent('change', { value: next });
    },
  },
});
