import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Corkboard` — a framed cork field with draggable notes. Notes
    register through the descendant relation; the board owns the position
    value (Record<id, {x,y,r,z}>), the bounds measurement and the polite
    status line. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'corkboard',
    llInkSelector: '.ll-corkboard',
    said: '',
  },
  relations: {
    '../corkboard-note/corkboard-note': {
      type: 'descendant',
      linked(child) {
        (this.__notes = this.__notes || []).push(child);
      },
      unlinked(child) {
        this.__notes = (this.__notes || []).filter((c) => c !== child);
      },
    },
  },
  observers: {
    value(value) {
      if (this.__controlled && value != null) {
        this.__latest = value;
        this.__push();
      }
    },
  },
  lifetimes: {
    attached() {
      // Snapshot before anything mirrors into the value property.
      this.__controlled = this.data.value != null;
      this.__latest = this.__controlled ? this.data.value : this.data.defaultValue || {};
      this.__sayTimer = null;
      setTimeout(() => this.__push(), 0);
    },
    ready() {
      this.createSelectorQuery()
        .select('.ll-corkboard__surface')
        .boundingClientRect((rect) => {
          if (rect) this.__bounds = { w: rect.width, h: rect.height };
          this.__push();
        })
        .exec();
    },
    detached() {
      if (this.__sayTimer) clearTimeout(this.__sayTimer);
    },
  },
  methods: {
    __push() {
      (this.__notes || []).forEach((n) => n.__onBoard({ positions: this.__latest || {}, disabled: !!this.data.disabled }));
    },
    /** Latest positions, controlled or not (notes read this on link). */
    __positions() {
      return this.__latest || {};
    },
    topZ() {
      const vals = Object.values(this.__positions());
      return vals.length ? Math.max(0, ...vals.map((p) => p.z ?? 0)) : 0;
    },
    bounds() {
      return this.__bounds || { w: 0, h: 0 };
    },
    /** Commit one note's move/turn/raise; optional message goes to status. */
    update(id, patch, message) {
      const cur = this.__positions();
      const next = { ...cur, [id]: { ...(cur[id] || {}), ...patch } };
      this.__latest = next;
      if (!this.__controlled) this.setData({ positions: next });
      this.triggerEvent('change', { value: next });
      if (message) this.say(message);
      this.__push();
    },
    say(message) {
      if (this.__sayTimer) clearTimeout(this.__sayTimer);
      this.__sayTimer = setTimeout(() => this.setData({ said: message }), 350);
    },
  },
});
