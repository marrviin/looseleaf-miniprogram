import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `NavigationMenuContent` — the open panel. Two placements:
    viewport mode hangs over the root's shared slip (absolutely positioned
    against the owner item, measured and reported so the slip can size
    itself); no-viewport mode draws its own slip Paper right under the item
    (upstream's group-data-[viewport=false] Paper classes). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    open: false,
    inVp: true,
    // Viewport-mode placement (px, relative to the owner item), computed
    // from rects so the panel sits over the shared slip.
    posLeft: 0,
    posTop: 0,
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
      linked() {
        setTimeout(() => this.__resolveValue(), 0);
      },
    },
    // In-panel links style themselves as rows (ll-swipe on active).
    '../navigation-menu-link/navigation-menu-link': {
      type: 'descendant',
      linked(child) {
        if (child.__onPanel) child.__onPanel(true);
      },
      unlinked(child) {
        if (child.__onPanel) child.__onPanel(false);
      },
    },
  },
  methods: {
    __ensureValue() {
      if (this.__navValue != null) return this.__navValue;
      const items = this.getRelationNodes('../navigation-menu-item/navigation-menu-item') || [];
      this.__navValue = items[0] && items[0].__ensureValue ? items[0].__ensureValue() : null;
      return this.__navValue;
    },
    __onValue() {
      this.__navValue = null;
      this.__ensureValue();
    },
    /** Root pushed the open state + viewport mode. */
    __onRoot({ open, viewport }) {
      const wasOpen = this.data.open;
      this.setData({ open: !!open, inVp: viewport !== false });
      if (open && !wasOpen) {
        // Show, settle a frame, then size the shared slip and place the
        // panel over it.
        setTimeout(() => this.__place(), 60);
      }
      if (!open && wasOpen) this.__report(0, 0);
    },
    /** Measure panel/item/root in the same frame, place the panel and
        report the panel size to the root (slip sizing). */
    __place() {
      if (!this.data.open || !this.data.inVp) return;
      const value = this.__ensureValue();
      const root = this.__root;
      const items = this.getRelationNodes('../navigation-menu-item/navigation-menu-item') || [];
      const item = items[0];
      let panelRect = null;
      let itemRect = null;
      let rootRect = null;
      let retried = false;
      const done = () => {
        if (!panelRect) return;
        if (!panelRect.width || !panelRect.height) {
          if (!retried) {
            retried = true;
            setTimeout(place, 120);
          }
          return;
        }
        if (value != null && root && root.__reportPanel) {
          root.__reportPanel(value, panelRect.width, panelRect.height);
        }
        if (itemRect && rootRect) {
          // The slip hangs at the root's start edge, mt-2 below it; the
          // panel sits exactly over it (z above the slip).
          this.setData({
            posLeft: rootRect.left - itemRect.left,
            posTop: rootRect.bottom + 8 - itemRect.top,
          });
        }
      };
      const place = () => {
        panelRect = itemRect = rootRect = null;
        this.createSelectorQuery().select('.ll-navigation-menu-content__inner').boundingClientRect((r) => {
          panelRect = r;
          done();
        }).exec();
        if (item) {
          item.createSelectorQuery().select('.ll-navigation-menu-item').boundingClientRect((r) => {
            itemRect = r;
            done();
          }).exec();
        }
        if (root) {
          root.createSelectorQuery().select('.ll-navigation-menu').boundingClientRect((r) => {
            rootRect = r;
            done();
          }).exec();
        }
      };
      place();
    },
    /** Report the panel's size (0 closes the shared slip). */
    __report(w, h) {
      const root = this.__root;
      if (root && root.__reportPanel) root.__reportPanel(this.__ensureValue(), w, h);
    },
    /** The root's value changed elsewhere — re-place under the new slip. */
    __sync() {
      if (this.data.open) setTimeout(() => this.__place(), 0);
    },
  },
});
