import { createComponent } from '../../common/component';
import { renderLayers, hashSeed, svgDataUri } from '../../common/ink';
import { RECIPES, runRecipe, bucketBox } from '../../common/ink-engine';
import { ensureHandFont } from '../../common/hand-font';

ensureHandFont();

export const props = {
  /** How many characters; that many slots render (upstream maxLength). */
  maxLength: {
    type: Number,
    value: 6,
    optionalTypes: [String],
  },
  value: {
    type: String,
    value: '',
  },
  /** Regex source the code must match, e.g. '[0-9]' or '[0-9A-Za-z]'
      (upstream pattern / REGEXP_ONLY_* presets). Anything refused is
      dropped, typed or pasted. */
  pattern: {
    type: String,
    value: '',
  },
  /** Red pencil boxes (upstream invalid / aria-invalid). */
  invalid: {
    type: Boolean,
    value: false,
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  /** Ghost char shown in the empty slots (upstream placeholder). */
  placeholder: {
    type: String,
    value: '',
  },
  /** Slot indices after which the drawn minus separator renders
      (upstream InputOTPSeparator children). */
  separatorAfter: {
    type: Array,
    value: [],
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};

/** ll-input-otp — upstream InputOTP: a one-time code as a row of separate
    hand-drawn boxes. One real (invisible) <input> covers the whole row, so
    typing, paste and the system keyboard are the platform's own; the boxes
    are drawn per slot from the otp-slot recipe (pencil when empty,
    fine-liner once filled, blue ring + blinking caret on the active slot,
    red when invalid, dashed when disabled). Events: `change` {value} on
    every edit, `complete` {value} when maxLength is reached. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: '',
    slots: [],
    inner: '',
    focused: false,
  },
  observers: {
    'value, maxLength, separatorAfter'() {
      this.__sync();
    },
    'invalid, disabled'() {
      this.__paint();
    },
  },
  lifetimes: {
    attached() {
      this.__sync();
      // slots lay out after attach; measure once the row has real boxes
      setTimeout(() => this.__paint(), 80);
      setTimeout(() => this.__paint(), 400);
    },
  },
  methods: {
    noop() {},
    __filter(raw) {
      const src = this.data.pattern;
      const stripped = String(raw || '').replace(/[\s‐-―-]+/g, '');
      if (!src) return stripped;
      try {
        const re = new RegExp(`^${src}*$`);
        return stripped
          .split('')
          .filter((c) => re.test(c))
          .join('');
      } catch (e) {
        return stripped;
      }
    },
    __sync() {
      const max = Number(this.data.maxLength) || 0;
      const val = String(this.data.value || '').slice(0, max);
      const slots = [];
      for (let i = 0; i < max; i++) {
        slots.push({ i, char: val[i] || '', filled: !!val[i], active: false });
      }
      this.setData({ slots, inner: val, inputType: this.data.pattern === '[0-9]' || this.data.pattern === '[0-9]*' ? 'number' : 'text' });
      this.__paint();
    },
    /** Per-slot ink: every slot is the same box, so measure once and render
        a style per slot state (renderLayers is cached by params). */
    __paint() {
      if (!this.__slotBox) {
        this.createSelectorQuery()
          .select('.ll-otp-slot')
          .boundingClientRect((rect) => {
            if (!rect || !rect.width) {
              setTimeout(() => this.__paint(), 120);
              return;
            }
            this.__slotBox = { w: rect.width, h: rect.height };
            this.__paint();
          })
          .exec();
        return;
      }
      const d = this.data;
      const max = Number(d.maxLength) || 0;
      const val = String(d.value || d.inner || '').slice(0, max);
      const seed = `${hashSeed(`otp:${d.seed || ''}`)}`;
      const box = bucketBox(this.__slotBox.w, this.__slotBox.h);
      const sepAfter = d.separatorAfter || [];
      // renderLayers skips the recipe's disabled layer (attachInk renders it
      // on demand via runRecipe) — draw it here the same way, once per paint.
      let disabledStyle = '';
      if (d.disabled) {
        const frame = runRecipe(RECIPES['otp-slot'], {
          tier: 'lo',
          density: 'comfortable',
          knobs: { wobble: 1, misreg: 1, bleed: 1, width: 1 },
          dir: 'ltr',
          box,
          params: { invalid: false, disabled: true, active: false, filled: false },
          seed,
          lazy: [],
        });
        if (frame && frame.parts.disabled) {
          disabledStyle = `inset:${-frame.pad}px;background-image:url("${svgDataUri(frame.parts.disabled, frame)}")`;
        }
      }
      const slots = [];
      const styles = [];
      for (let i = 0; i < max; i++) {
        const active = d.focused && !d.disabled && i === Math.min(val.length, max - 1) && val.length < max;
        if (d.disabled) {
          slots.push({ i, char: val[i] || '', filled: !!val[i], active: false, sep: sepAfter.indexOf(i) !== -1 && i < max - 1 });
          styles.push(disabledStyle);
          continue;
        }
        const params = { invalid: !!d.invalid, disabled: false, active, filled: !!val[i] };
        const entry = renderLayers('otp-slot', box, params, seed);
        let style = '';
        if (entry) {
          const stack = [];
          if (active && entry.uris.focus) stack.push(entry.uris.focus);
          stack.push(entry.uris.rest || entry.uris.invalid);
          style = `inset:${-entry.pad}px;background-image:${stack.filter(Boolean).map((u) => `url("${u}")`).join(',')}`;
        }
        slots.push({ i, char: val[i] || '', filled: !!val[i], active, sep: sepAfter.indexOf(i) !== -1 && i < max - 1 });
        styles.push(style);
      }
      this.setData({ slots, slotStyles: styles });
    },
    onInput(e) {
      const max = Number(this.data.maxLength) || 0;
      const v = this.__filter(e.detail.value).slice(0, max);
      this.setData({ inner: v, value: v });
      this.triggerEvent('change', { value: v });
      if (v.length === max) this.triggerEvent('complete', { value: v });
      this.__paint();
    },
    onFocus() {
      this.setData({ focused: true });
      this.__paint();
      this.triggerEvent('focus', {});
    },
    onBlur() {
      this.setData({ focused: false });
      this.__paint();
      this.triggerEvent('blur', {});
    },
    focus() {
      this.setData({ focused: true });
      this.__paint();
    },
  },
});
