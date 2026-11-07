import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `NavigationMenuItem` (the LI) — a plain wrapper that names its
    trigger/content pair: its value (explicit or `item-<index>`) is what the
    root's open value matches against. Children pull it through the
    descendant relation. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  relations: {
    '../navigation-menu-list/navigation-menu-list': {
      type: 'ancestor',
      linked() {
        setTimeout(() => this.__resolveValue(), 0);
      },
    },
    '../navigation-menu-trigger/navigation-menu-trigger': {
      type: 'descendant',
      linked() {
        setTimeout(() => this.__resolveValue(), 0);
      },
    },
    '../navigation-menu-content/navigation-menu-content': {
      type: 'descendant',
      linked() {
        setTimeout(() => this.__resolveValue(), 0);
      },
    },
  },
  methods: {
    /** The explicit value or the auto `item-<index>` from the list. */
    __ensureValue() {
      if (this.__value != null) return this.__value;
      const idx = this.__navIndex != null ? this.__navIndex : 0;
      this.__value = `item-${idx}`;
      return this.__value;
    },
    __resolveValue() {
      const explicit = this.data.value;
      this.__value = explicit != null && explicit !== '' ? explicit : null;
      // Tell descendants their value may have changed.
      for (const t of this.getRelationNodes('../navigation-menu-trigger/navigation-menu-trigger') || []) {
        if (t.__onValue) t.__onValue();
      }
      for (const c of this.getRelationNodes('../navigation-menu-content/navigation-menu-content') || []) {
        if (c.__onValue) c.__onValue();
      }
    },
    /** The list re-assigned indices (an item was added/removed). */
    __valueChanged() {
      this.__value = null;
      this.__resolveValue();
    },
  },
});
