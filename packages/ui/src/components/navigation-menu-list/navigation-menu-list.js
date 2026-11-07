import { createComponent } from '../../common/component';

/** Upstream `NavigationMenuList` (the UL) — the row of tabs and the ink host
    of the pencil line they stand on (navigation-menu-baseline recipe). It
    also places the felt-tip indicator under the open trigger: it probes the
    trigger's box (descendant relation) and hands the ready left/width to the
    indicator (upstream: Radix measures and positions the Indicator). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  data: {
    llInkRecipe: 'navigation-menu-baseline',
    llInkSelector: '.ll-navigation-menu-list',
  },
  relations: {
    '../navigation-menu/navigation-menu': {
      type: 'ancestor',
      linked(parent) {
        this.__root = parent;
        setTimeout(() => parent.__sync(), 0);
      },
      unlinked() {
        this.__root = null;
      },
    },
    '../navigation-menu-item/navigation-menu-item': {
      type: 'descendant',
      linked() {
        setTimeout(() => this.__assignIndices(), 0);
      },
      unlinked() {
        setTimeout(() => this.__assignIndices(), 0);
      },
    },
    '../navigation-menu-indicator/navigation-menu-indicator': {
      type: 'descendant',
      linked(child) {
        this.__indicator = child;
        setTimeout(() => this.__positionIndicator(), 0);
      },
      unlinked(child) {
        if (this.__indicator === child) this.__indicator = null;
      },
    },
    // Probed when positioning the indicator (the open value's owner).
    '../navigation-menu-trigger/navigation-menu-trigger': {
      type: 'descendant',
    },
    '../navigation-menu-link/navigation-menu-link': {
      type: 'descendant',
    },
  },
  methods: {
    /** The root's open value changed (or the layout may have moved). */
    __onRoot({ value }) {
      if (value === this.__navValue) {
        this.__positionIndicator(); // still re-probe: layout may have moved
        return;
      }
      this.__navValue = value;
      this.__positionIndicator();
    },
    /** Item order for auto values (item.value || `item-<index>`). */
    __assignIndices() {
      const nodes = this.getRelationNodes('../navigation-menu-item/navigation-menu-item') || [];
      nodes.forEach((n, i) => {
        n.__navIndex = i;
        if (n.__valueChanged) n.__valueChanged();
      });
    },
    /** Measure the open trigger and slide the indicator under it. */
    __positionIndicator() {
      const ind = this.__indicator;
      if (!ind) return;
      const value = this.__navValue;
      if (!value) {
        ind.__setPosition({ visible: false });
        return;
      }
      const triggers = this.getRelationNodes('../navigation-menu-trigger/navigation-menu-trigger') || [];
      const target = triggers.find((t) => t.__ensureValue && t.__ensureValue() === value);
      if (!target) {
        // A strip link can be open-flagged too (active without a panel):
        // fall back to the link with the same value.
        const links = this.getRelationNodes('../navigation-menu-link/navigation-menu-link') || [];
        const link = links.find((l) => l.__ensureValue && l.__ensureValue() === value);
        if (!link) {
          ind.__setPosition({ visible: false });
          return;
        }
        this.__probe(ind, link);
        return;
      }
      this.__probe(ind, target);
    },
    /** Probe the target's box and the list's box, then place the indicator. */
    __probe(ind, node) {
      let listRect = null;
      let nodeRect = null;
      let retried = false;
      const done = () => {
        if (!listRect || !nodeRect) {
          if (!retried) {
            retried = true; // not laid out yet — try once more
            setTimeout(probe, 120);
          }
          return;
        }
        ind.__setPosition({
          visible: true,
          left: nodeRect.left - listRect.left,
          width: nodeRect.width,
        });
      };
      const probe = () => {
        listRect = nodeRect = null;
        this.createSelectorQuery().select('.ll-navigation-menu-list').boundingClientRect((r) => {
          listRect = r;
          done();
        }).exec();
        node.__measure((r) => {
          nodeRect = r;
          done();
        });
      };
      probe();
    },
  },
});
