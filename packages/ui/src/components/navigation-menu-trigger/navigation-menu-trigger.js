import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `NavigationMenuTrigger` (a NavTab with role=trigger) — the strip
    button: whisper pencil sketch at rest, a hi wash + grown outline when its
    panel is open (rest sketch hides; navigation-menu-tab recipe). Tap toggles
    the panel through the root. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'navigation-menu-tab',
    open: false,
  },
  relations: {
    '../navigation-menu/navigation-menu': {
      type: 'ancestor',
      linked(parent) {
        this.__root = parent;
      },
      unlinked() {
        this.__root = null;
      },
    },
    '../navigation-menu-item/navigation-menu-item': {
      type: 'ancestor',
      // __resolveValue lives on the ITEM — ask the newly-linked item to
      // resolve (`this.__resolveValue()` threw in the real runtime).
      linked(item) {
        setTimeout(() => item.__resolveValue(), 0);
      },
    },
    // Pairs with the list's descendant declaration (indicator probing).
    '../navigation-menu-list/navigation-menu-list': {
      type: 'ancestor',
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({ role: 'trigger', disabled: !!this.data.disabled });
    },
  },
  methods: {
    /** The owning item's value (explicit or `item-<index>`). */
    __ensureValue() {
      if (this.__navValue != null) return this.__navValue;
      const items = this.getRelationNodes('../navigation-menu-item/navigation-menu-item') || [];
      this.__navValue = items[0] && items[0].__ensureValue ? items[0].__ensureValue() : null;
      return this.__navValue;
    },
    /** The item's value changed (auto re-index). */
    __onValue() {
      this.__navValue = null;
      this.__ensureValue();
    },
    /** Root pushed the open state. */
    __onRoot({ open }) {
      if (!!open === this.data.open) return;
      // attachInk observes data.open and re-renders the layer.
      this.setData({ open: !!open });
    },
    /** Box probe for the list's indicator positioning. */
    __measure(cb) {
      this.createSelectorQuery()
        .select('.ll-navigation-menu-tab')
        .boundingClientRect(cb)
        .exec();
    },
    onTap() {
      if (this.data.disabled || !this.__root) return;
      this.__root.__onTrigger(this.__ensureValue());
    },
  },
});
