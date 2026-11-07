import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `RadioGroupItem` — a 16 px hand-drawn ring; the chosen one gets a
    terracotta blot with a felt spiral written into it (radio recipe, layers
    rest/hover/checked/focus). Group state arrives through the ancestor
    relation: checked = group value matches, disabled/invalid OR in. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'radio-group',
    llInkSelector: '.ll-radio',
    checked: false,
    off: false,
    bad: false,
    px: 16,
  },
  relations: {
    '../radio-group/radio-group': {
      type: 'ancestor',
      linked(parent) {
        this.__group = parent;
        setTimeout(() => parent.__sync(), 0);
      },
      unlinked() {
        this.__group = null;
      },
    },
  },
  observers: {
    size() {
      const n = Number(this.data.size);
      this.setData({ px: Math.max(8, Math.round(Number.isFinite(n) && n > 0 ? n : 16)) });
    },
    'checked'() {
      this.__applyInkLayer();
    },
    'disabled, invalid'() {
      this.__recompute();
    },
  },
  lifetimes: {
    attached() {
      this.__recompute();
    },
  },
  methods: {
    /** Recompute effective state (own props OR group) and redraw. */
    __recompute() {
      const g = this.__group ? this.__group.data : null;
      const off = this.data.disabled || !!(g && g.disabled);
      const bad = this.data.invalid || !!(g && g.invalid);
      const checked = g && g.value !== '' ? g.value === this.data.value : this.data.checked;
      this.__inkParams = () => ({ disabled: off, invalid: bad });
      this.setData({ off, bad, checked });
      setTimeout(() => this.__renderInk(), 0);
    },
    /** Called by the group whenever its value/disabled/invalid change. */
    __onGroup(groupData) {
      this.__recompute();
    },
    onTap() {
      if (this.data.off) return;
      if (this.__group) {
        this.__group.__onRadioTap(this.data.value);
        return;
      }
      // standalone: act like a checkbox toggle (upstream items need a group)
      if (this.data.checked) return;
      this.setData({ checked: true });
      this.triggerEvent('change', { value: this.data.value });
    },
  },
});
