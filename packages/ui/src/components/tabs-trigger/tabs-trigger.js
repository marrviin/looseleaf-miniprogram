import { createComponent } from '../../common/component';
import { props } from './props';
import { ensureHandFont } from '../../common/hand-font';

/** Upstream `TabsTrigger` — the drawn index-divider tab. The ink recipe
    draws against variant ('default' | 'line') and orientation; the active
    tab shows the recipe's checked layer (lifted + highlighter fill, or the
    blue felt underline for line). */
ensureHandFont();
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'tabs',
    // The recipe id is 'tabs' but this trigger root is the ink host.
    llInkSelector: '.ll-tabs-trigger',
    checked: false,
    tabVariant: 'default',
    tabOrientation: 'horizontal',
  },
  relations: {
    '../tabs-list/tabs-list': {
      type: 'ancestor',
      linked(parent) {
        this.__list = parent;
        setTimeout(() => this.__onList(parent.data), 0);
      },
      unlinked() {
        this.__list = null;
      },
    },
    '../tabs/tabs': {
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
  lifetimes: {
    attached() {
      this.__inkParams = () => ({
        variant: this.data.tabVariant,
        orientation: this.data.tabOrientation,
        disabled: this.data.disabled,
      });
    },
  },
  methods: {
    /** ll-tabs root syncs value + orientation. */
    __onGroup(ctx) {
      const checked = ctx.value === this.data.value && ctx.value !== '';
      this.__inkParams = () => ({
        variant: this.data.tabVariant,
        orientation: ctx.orientation,
        disabled: this.data.disabled,
      });
      this.setData({ checked, tabOrientation: ctx.orientation });
      setTimeout(() => this.__measureInk(), 60);
    },
    /** ll-tabs-list syncs the drawing variant. */
    __onList(list) {
      if (list.variant === this.data.tabVariant) return;
      this.setData({ tabVariant: list.variant });
      setTimeout(() => this.__measureInk(), 60);
    },
    onTap() {
      if (this.data.disabled) return;
      if (this.__group) this.__group.__onTriggerTap(this.data.value);
      this.triggerEvent('tap', { value: this.data.value });
    },
  },
});
