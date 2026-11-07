import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `NavigationMenu` (Radix root) — a site's top navigation strip.
    Holds which item is open and renders the shared viewport slip after its
    children (viewport mode); the open panel reports its size and hangs under
    the strip over the slip. Triggers and contents register through the
    descendant relation (upstream: Radix context + DOM measurement). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    vp: true,
    // Shared slip size (px), measured from the open panel; 0 hides it.
    slipW: 0,
    slipH: 0,
  },
  relations: {
    '../navigation-menu-list/navigation-menu-list': {
      type: 'descendant',
      linked() {
        setTimeout(() => this.__sync(), 0);
      },
      unlinked() {
        setTimeout(() => this.__sync(), 0);
      },
    },
    '../navigation-menu-trigger/navigation-menu-trigger': {
      type: 'descendant',
      linked() {
        setTimeout(() => this.__sync(), 0);
      },
      unlinked() {
        setTimeout(() => this.__sync(), 0);
      },
    },
    '../navigation-menu-content/navigation-menu-content': {
      type: 'descendant',
      linked() {
        setTimeout(() => this.__sync(), 0);
      },
      unlinked() {
        setTimeout(() => this.__sync(), 0);
      },
    },
  },
  observers: {
    'value, viewport'() {
      setTimeout(() => this.__sync(), 0);
    },
  },
  lifetimes: {
    attached() {
      this.setData({
        vp: !!this.data.viewport,
        value: this.data.value || this.data.defaultValue || '',
      });
      setTimeout(() => this.__sync(), 0);
    },
  },
  methods: {
    /** Push the open state onto every trigger and content, the value onto
        the list (which drives the indicator). */
    __sync() {
      const value = this.data.value;
      for (const t of this.getRelationNodes('../navigation-menu-trigger/navigation-menu-trigger') || []) {
        if (t.__onRoot) t.__onRoot({ open: !!value && t.__ensureValue() === value });
      }
      for (const c of this.getRelationNodes('../navigation-menu-content/navigation-menu-content') || []) {
        if (c.__onRoot) c.__onRoot({ open: !!value && c.__ensureValue() === value, viewport: this.data.vp });
      }
      for (const l of this.getRelationNodes('../navigation-menu-list/navigation-menu-list') || []) {
        if (l.__onRoot) l.__onRoot({ value });
      }
    },
    /** A trigger was tapped: toggle its panel, announce it. */
    __onTrigger(value) {
      const next = this.data.value === value ? '' : value;
      this.setData({ value: next });
      this.triggerEvent('change', { value: next });
      this.__sync();
    },
    /** The open panel reported its size — resize the shared slip. A zero
        size only clears when it comes from the still-open panel, so closing
        panel A never hides the slip under freshly opened panel B. */
    __reportPanel(senderValue, w, h) {
      if (!w) {
        // A zero size clears the slip — but only from the still-open panel
        // (a stale close from panel A must not hide the slip under freshly
        // opened panel B). When the menu closed entirely (value ''), any
        // closing panel may clear it.
        if (this.data.value && senderValue !== this.data.value) return;
        this.setData({ slipW: 0, slipH: 0 });
        return;
      }
      if (senderValue !== this.data.value) return;
      if (w !== this.data.slipW || h !== this.data.slipH) this.setData({ slipW: w, slipH: h });
    },
  },
});
