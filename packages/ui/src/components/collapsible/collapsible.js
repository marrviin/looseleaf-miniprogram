import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Collapsible` — the open state lives here and is pushed to
    trigger/content/indicator (both sides declare the relation). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    open: false,
  },
  observers: {
    open(v) {
      this.__applyOpenProp(v);
    },
  },
  relations: {
    '../collapsible-trigger/collapsible-trigger': { type: 'descendant' },
    '../collapsible-content/collapsible-content': { type: 'descendant' },
    '../collapsible-indicator/collapsible-indicator': { type: 'descendant' },
  },
  lifetimes: {
    attached() {
      // The `open` property and the internal flag share this.data.open in
      // the mp runtime, so the folded state is tracked in this.__open —
      // a parent-driven change is then detectable even when the property
      // write has already landed in data.
      const fromProp = this.data.open === true || this.data.open === 'true';
      const init =
        fromProp || this.data.defaultOpen === true || this.data.defaultOpen === 'true';
      this.__open = init;
      this.setData({ open: init });
      setTimeout(() => this.__push(), 0);
    },
  },
  methods: {
    toggle() {
      this.__open = !this.__open;
      this.setData({ open: this.__open });
      this.triggerEvent('openchange', { open: this.__open });
      this.__push();
      return this.__open;
    },
    /** Property → state sync; idempotent (the attached hook may race it). */
    __applyOpenProp(v) {
      const next = v === true || v === 'true';
      if (next !== this.__open) {
        this.__open = next;
        this.setData({ open: next });
        this.__push();
      }
    },
    __push() {
      const open = this.data.open;
      const nodes = [
        ...(this.getRelationNodes('../collapsible-trigger/collapsible-trigger') || []),
        ...(this.getRelationNodes('../collapsible-content/collapsible-content') || []),
        ...(this.getRelationNodes('../collapsible-indicator/collapsible-indicator') || []),
      ];
      for (const n of nodes) n.__onRoot && n.__onRoot({ open });
    },
  },
});
