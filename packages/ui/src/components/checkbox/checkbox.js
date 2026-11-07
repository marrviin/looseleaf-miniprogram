import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Checkbox` (radix) — a 16 px hand-drawn box; checking it fills a
    marker blob and draws the check with the reveal mask (checkbox recipe,
    layers rest/hover/checked/indeterminate/focus). Disabled and invalid are
    draw params (they change the rest layer), so they re-render the ink;
    checked/indeterminate just pick the on-state layer in __applyInkLayer. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'checkbox',
    px: 16,
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({ disabled: !!this.data.disabled, invalid: !!this.data.invalid });
    },
  },
  observers: {
    size: {
      // attachInk also watches `size` for the re-measure; this mirrors the
      // px into the box style.
      handler() {
        const n = Number(this.data.size);
        this.setData({ px: Math.max(8, Math.round(Number.isFinite(n) && n > 0 ? n : 16)) });
      },
    },
    'disabled, invalid'() {
      this.__inkParams = () => ({ disabled: !!this.data.disabled, invalid: !!this.data.invalid });
      setTimeout(() => this.__renderInk(), 0);
    },
    'checked, indeterminate'() {
      this.__applyInkLayer();
    },
  },
  methods: {
    onTap() {
      if (this.data.disabled) return;
      const value = this.data.indeterminate ? true : !this.data.checked;
      this.setData({ checked: value, indeterminate: false });
      this.triggerEvent('change', { value });
    },
  },
});
