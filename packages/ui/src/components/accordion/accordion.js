import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Accordion` — the Radix root. Owns the open rows; items register
    through the descendant relation, a tap or property change syncs every
    item's open/disabled state. Panels open without the height animation
    (the reduced-motion behavior upstream). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    open: [],
  },
  relations: {
    '../accordion-item/accordion-item': {
      type: 'descendant',
      linked(child) {
        (this.__items = this.__items || []).push(child);
      },
      unlinked(child) {
        this.__items = (this.__items || []).filter((c) => c !== child);
      },
    },
  },
  observers: {
    'value, defaultValue, disabled'() {
      // Controlled changes flow through here: adopt the value (Radix keeps
      // the controlled prop authoritative), then re-sync the items.
      const v = this.data.value || this.data.defaultValue;
      if (v) {
        const next = Array.isArray(v) ? v : [v];
        if (next.join('|') !== this.data.open.join('|')) this.data.open = next;
      }
      setTimeout(() => this.__sync(), 0);
    },
  },
  lifetimes: {
    attached() {
      const initial = this.data.value || this.data.defaultValue;
      if (initial) this.data.open = Array.isArray(initial) ? initial : [initial];
      setTimeout(() => this.__sync(), 0);
    },
  },
  methods: {
    __sync() {
      const ctx = {
        open: this.data.open,
        disabled: this.data.disabled,
        bracket: this.data.bracket,
      };
      (this.__items || []).forEach((it) => it.__onRoot(ctx));
    },
    /** A trigger was tapped: toggle its row. */
    __onTriggerTap(value) {
      const single = this.data.type !== 'multiple';
      let open = this.data.open.slice();
      if (open.includes(value)) {
        if (single && !this.data.collapsible) return;
        open = open.filter((v) => v !== value);
      } else {
        if (single) open = [value];
        else open.push(value);
      }
      this.setData({ open, value: single ? open[0] ?? '' : open });
      this.__sync();
      this.triggerEvent('change', { value: single ? open[0] ?? '' : open });
    },
  },
});
