import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `NavigationMenuLink` — one component, two faces. Inside a panel
    (descendant of ll-navigation-menu-content) it renders the InPanel row:
    hand text, p-2, the ll-swipe wipe when active. In the strip it renders a
    NavTab with role=link: the checked layer (blobFill hi) when active. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    inPanel: false,
    llInkRecipe: 'navigation-menu-tab',
  },
  relations: {
    '../navigation-menu-content/navigation-menu-content': {
      type: 'ancestor',
      linked(parent) {
        this.__content = parent;
        this.setData({ inPanel: true });
      },
      unlinked() {
        this.__content = null;
        this.setData({ inPanel: false });
      },
    },
    // Pairs with the list's descendant declaration (indicator probing).
    '../navigation-menu-list/navigation-menu-list': {
      type: 'ancestor',
    },
  },
  observers: {
    active(a) {
      // Strip mode: the checked layer (blobFill hi) stacks over rest.
      this.setData({ checked: !!a });
      setTimeout(() => this.__applyInkLayer(), 0);
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({ role: 'link' });
      this.setData({ checked: !!this.data.active });
    },
  },
  methods: {
    __ensureValue() {
      return this.data.value || null;
    },
    onTap() {
      // In-panel links select: close the open panel (upstream Radix closes
      // on link select). Strip links just navigate — the page's bindtap
      // handles it.
      if (!this.data.inPanel) return;
      const content = this.__content;
      const root = content && content.__root;
      if (root && root.data.value) root.__onTrigger(root.data.value);
    },
  },
});
