import { createComponent } from '../../common/component';
import { props, validators } from './props';

/** Upstream `Toggle` / `ToggleGroupItem` — a two-state button that stays down:
    a whisper pencil box at rest, a highlighter body that snaps in when on
    (toggle recipe, layers rest/hover/checked/focus). One component plays both
    upstream roles (the radio/radio-group pattern): standalone it owns its
    `pressed` state; inside an ll-toggle-group it reads variant/size/tone/
    spacing/orientation/disabled/invalid from the group, draws only its seam
    when joined (the group draws the one box) and reports taps to the group.
    Upstream hides the first joined item's seam with CSS ([data-part=seam]);
    the port cuts the named group out of the SVG (ink.js stripParts). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'toggle',
    // Effective variant/size after group context (wxml classes); `joined`
    // items drop their own box and draw the seam at their start edge.
    v: 'default',
    esz: 'default',
    joined: false,
    checked: false,
  },
  relations: {
    '../toggle-group/toggle-group': {
      type: 'ancestor',
      linked(parent) {
        this.__tg = parent;
        setTimeout(() => parent.__sync(), 0);
      },
      unlinked() {
        this.__tg = null;
        setTimeout(() => this.__recompute(), 0);
      },
    },
  },
  observers: {
    pressed(p) {
      // The checked layer (highlighter body) stacks over rest when on —
      // __applyInkLayer keys on data.checked.
      this.setData({ checked: !!p });
      setTimeout(() => this.__applyInkLayer(), 0);
    },
    'variant, size, tone, disabled, invalid'() {
      this.__recompute();
    },
  },
  lifetimes: {
    attached() {
      this.__recompute();
    },
  },
  methods: {
    /** Effective state: own props OR toggle-group context, plus the joined
        decision (upstream ToggleGroupItem's context math) and the seam strip
        for the first joined item. */
    __recompute() {
      const g = this.__tg ? this.__tg.data : null;
      const ownV = validators.variant.includes(this.data.variant) ? this.data.variant : 'default';
      const v = (g && g.variant) || ownV;
      const esz = (g && g.size) || this.data.size || 'default';
      const tone = (g && g.tone) || this.data.tone || 'hi';
      const spacing = g ? g.spacing : null;
      const joined = g ? spacing === 0 && (v !== 'outline' || g.variant === 'outline') : false;
      const off = this.data.disabled || !!(g && g.disabled);
      const bad = this.data.invalid || !!(g && g.invalid);
      const vertical = !!(g && g.orientation === 'vertical');
      const pressed = g
        ? g.type === 'multiple'
          ? Array.isArray(g.value) && g.value.includes(this.data.value)
          : g.value === this.data.value
        : this.data.pressed;
      this.__inkParams = () => ({ variant: v, size: esz, disabled: off, tone, joined, vertical, invalid: bad });
      // First joined item: no seam at its start edge (the neighbor before it
      // doesn't exist). Applied in __renderInk via renderLayers stripParts.
      this.__inkStrip = joined && (!this.__tg || this.__tg.__isFirst(this)) ? ['seam'] : null;
      this.setData({ v, esz, joined, checked: !!pressed, pressed: !!pressed });
      setTimeout(() => this.__renderInk(), 0);
    },
    /** Called by the group whenever its context/state changes. */
    __onGroup() {
      this.__recompute();
    },
    onTap() {
      if (this.data.disabled) return;
      if (this.__tg) {
        this.__tg.__onItemToggle(this.data.value, !this.data.pressed);
        return;
      }
      const pressed = !this.data.pressed;
      this.setData({ pressed, checked: pressed });
      this.triggerEvent('change', { pressed });
    },
  },
});
