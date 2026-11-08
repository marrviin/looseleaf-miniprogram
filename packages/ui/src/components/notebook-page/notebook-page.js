import { createComponent } from '../../common/component';

/** Upstream `NotebookPage` — one page of writing; with a `value`, only the
    current page is shown (the owning ll-notebook broadcasts). A valued
    page that turns on unfolds from the dog-ear corner (a clip-path wipe;
    only for pages turned to after load). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  relations: {
    '../notebook/notebook': {
      type: 'ancestor',
      linked(parent) {
        this.__parent = parent;
        if (parent.__pageLinked) parent.__pageLinked(this);
      },
      unlinked(parent) {
        this.__parent = null;
      },
    },
  },
  properties: {
    /** This page's name; without one the page is always shown. */
    value: {
      type: String,
      value: '',
    },
    customStyle: String,
  },
  data: {
    active: true,
    armed: false,
    unfold: false,
  },
  lifetimes: {
    attached() {
      // "armed" — the unfold wipe never plays for the page that is there
      // at load (upstream starts the transition only once mounted).
      this.setData({ armed: true });
    },
  },
  methods: {
    /** Called by the owning ll-notebook. */
    __setActive(active) {
      const d = this.data;
      const wasInactive = !d.active;
      this.setData({
        active,
        // a valued page that turns on wipes in from the dog-ear corner
        unfold: !!(active && wasInactive && d.armed && d.value),
      });
    },
  },
});
