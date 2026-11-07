import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `TabsList` — the role=tablist row (or column). Triggers read
    the variant from here (upstream: TabsContext). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    orientation: 'horizontal',
  },
  relations: {
    '../tabs/tabs': {
      type: 'ancestor',
      linked(parent) {
        setTimeout(() => parent.__sync(), 0);
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
  },
  lifetimes: {
    attached() {
      setTimeout(() => this.__sync(), 0);
    },
  },
  observers: {
    variant() {
      setTimeout(() => this.__sync(), 0);
    },
  },
  methods: {
    /** ll-tabs root syncs the orientation (upstream: TabsContext). */
    __onGroup(ctx) {
      if (ctx.orientation !== this.data.orientation) {
        this.setData({ orientation: ctx.orientation });
      }
      this.__sync();
    },
    __sync() {
      (this.__triggers || []).forEach((t) => t.__onList(this.data));
    },
  },
});
