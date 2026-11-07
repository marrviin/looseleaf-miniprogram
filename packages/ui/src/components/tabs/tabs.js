import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Tabs` — the Radix root. Owns the value; triggers register
    through the descendant relation, a value change syncs every trigger's
    active state and every content panel. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    current: '',
  },
  relations: {
    '../tabs-list/tabs-list': {
      type: 'descendant',
      linked(child) {
        (this.__lists = this.__lists || []).push(child);
      },
      unlinked(child) {
        this.__lists = (this.__lists || []).filter((c) => c !== child);
      },
    },
    '../tabs-trigger/tabs-trigger': {
      type: 'descendant',
      linked(child) {
        (this.__triggers = this.__triggers || []).push(child);
      },
      unlinked(child) {
        this.__triggers = (this.__triggers || []).filter((c) => c !== child);
      },
    },
    '../tabs-content/tabs-content': {
      type: 'descendant',
      linked(child) {
        (this.__contents = this.__contents || []).push(child);
      },
      unlinked(child) {
        this.__contents = (this.__contents || []).filter((c) => c !== child);
      },
    },
  },
  observers: {
    'value, defaultValue'() {
      // Controlled changes flow through here: adopt the value (Radix keeps
      // the controlled prop authoritative), then re-sync the children.
      const next = this.data.value || this.data.defaultValue;
      if (next && next !== this.data.current) this.data.current = next;
      setTimeout(() => this.__sync(), 0);
    },
  },
  lifetimes: {
    attached() {
      // Uncontrolled: adopt defaultValue like Radix (first trigger is the
      // fallback when neither is set — Radix's default behavior).
      const initial = this.data.value || this.data.defaultValue;
      if (!initial) {
        // defer until triggers linked
        setTimeout(() => {
          const first = (this.__triggers || [])[0];
          if (first) {
            this.setData({ current: first.data.value });
            this.__sync();
          }
        }, 0);
      } else {
        this.setData({ current: initial });
      }
      setTimeout(() => this.__sync(), 0);
    },
  },
  methods: {
    __sync() {
      const current = this.data.current;
      const ctx = { value: current, orientation: this.data.orientation };
      (this.__lists || []).forEach((l) => l.__onGroup(ctx));
      (this.__triggers || []).forEach((t) => t.__onGroup(ctx));
      (this.__contents || []).forEach((c) => c.__onGroup(ctx));
    },
    /** A trigger was tapped: adopt its value, announce it. */
    __onTriggerTap(value) {
      if (value === this.data.current) return;
      this.setData({ current: value, value });
      this.__sync();
      this.triggerEvent('change', { value });
    },
  },
});
