import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { badgesStamps, STAMP_KNOB } from '../../common/ink-engine';
import { props, validators } from './props';

// Button labels are set in the upstream hand font (Kevin Sans); loading is
// idempotent and silently degrades to the system font.
ensureHandFont();

const blank = (v) => v === '' || v === undefined || v === null || v === false;
const titleCase = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '');

/** Upstream `StampButton` — the tool: pad ink from the preset (or `ink`),
    a label on the die, a handle on top. Touch sinks the die and inks it
    heavier (the recipe's pressed layer). Striking reports the aim to the
    page — an ll-stamp-surface's strike() places the impression (upstream
    reaches the surface through React context, which cannot cross a
    component boundary here).
    Events: `stamp` {id, x, y, name, text, shape, ink, sub, ring, w, h,
    size, ghost, dashed, say}. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'stamp-button',
    label: '',
    pressed: false,
  },
  observers: {
    'stamp, text, ink'() {
      this.__syncInk();
    },
  },
  lifetimes: {
    attached() {
      this.__syncInk();
    },
  },
  methods: {
    noop() {},
    __syncInk() {
      const d = this.data;
      const preset = d.stamp && badgesStamps[d.stamp] && badgesStamps[d.stamp].gen === 'stamp' ? badgesStamps[d.stamp] : undefined;
      const words = d.text || (preset && preset.text) || d.stamp || '';
      this.__preset = preset;
      this.__inkParams = () => ({
        ink: validators.ink.includes(d.ink) ? d.ink : (preset && preset.ink) || 'red',
      });
      this.setData({ label: d.text ? d.text : titleCase(String(words).replace(/^stamp-/, '').replace(/-/g, ' ')) });
    },
    /** The aim the surface's strike() gets. */
    aim() {
      const d = this.data;
      const preset = this.__preset || {};
      const num = (v, f) => {
        const n = Number(v);
        return Number.isFinite(n) && !blank(v) ? n : f;
      };
      return {
        id: d.impressionId || d.stamp || d.text || 'stamp',
        x: num(d.placeX, 0.72),
        y: num(d.placeY, 0.6),
        name: d.stamp || '',
        text: d.text || '',
        shape: validators.shape.includes(d.shape) ? d.shape : preset.shape || '',
        ink: validators.ink.includes(d.ink) ? d.ink : (preset && preset.ink) || '',
        sub: blank(d.sub) ? '' : d.sub,
        ring: blank(d.ring) ? '' : d.ring,
        w: num(d.w, 0),
        h: num(d.h, 0),
        size: num(d.size, 0),
        ghost: blank(d.ghost) ? null : true,
        dashed: !!d.dashed,
        say: titleCase(String(d.text || d.stamp || '').replace(/^stamp-/, '').replace(/-/g, ' ')),
      };
    },
    onDown() {
      if (this.data.disabled) return;
      this.setData({ pressed: true });
    },
    onUp() {
      if (this.data.pressed) this.setData({ pressed: false });
    },
    onPress() {
      if (this.data.disabled) return;
      this.triggerEvent('stamp', this.aim());
    },
    /** Verification hook: strike without a touch event. */
    stampNow() {
      if (this.data.disabled) return null;
      this.triggerEvent('stamp', this.aim());
      return this.aim();
    },
  },
});
