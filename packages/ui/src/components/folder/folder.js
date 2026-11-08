import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Folder` — a manila folder that is also a set of tabs (Radix
    Tabs root): owns the value; tabs and panels register through the
    descendant relations, a value change syncs every tab's active state and
    every panel, along with the folder's stock. */
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
    '../folder-tab/folder-tab': {
      type: 'descendant',
      linked(child) {
        (this.__tabs = this.__tabs || []).push(child);
      },
      unlinked(child) {
        this.__tabs = (this.__tabs || []).filter((c) => c !== child);
      },
    },
    '../folder-content/folder-content': {
      type: 'descendant',
      linked(child) {
        (this.__contents = this.__contents || []).push(child);
        if (this.__ready) this.__sync();
      },
      unlinked(child) {
        this.__contents = (this.__contents || []).filter((c) => c !== child);
      },
    },
  },
  observers: {
    'value, defaultValue'() {
      const next = this.data.value || this.data.defaultValue;
      if (next && next !== this.data.current) this.data.current = next;
      setTimeout(() => this.__sync(), 0);
    },
  },
  lifetimes: {
    attached() {
      const initial = this.data.value || this.data.defaultValue;
      if (initial) this.data.current = initial;
      setTimeout(() => {
        if (!this.data.current) {
          const first = (this.__tabs || [])[0];
          if (first) this.data.current = first.data.value;
        }
        this.__sync();
      }, 0);
    },
    ready() {
      this.__ready = true;
    },
  },
  methods: {
    __sync() {
      const current = this.data.current;
      const stock = this.data.stock || 'kraft';
      (this.__tabs || []).forEach((t) => t.__onFolder({ value: current, stock }));
      (this.__contents || []).forEach((c) => c.__onFolder({ active: c.data.value === current, stock }));
    },
    /** A tab was tapped: adopt its value, announce it. */
    __onTabTap(value) {
      if (value === this.data.current) return;
      this.setData({ current: value, value });
      this.__sync();
      this.triggerEvent('change', { value });
    },
  },
});
