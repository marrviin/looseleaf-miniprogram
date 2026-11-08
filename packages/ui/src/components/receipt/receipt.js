import { createComponent } from '../../common/component';
import { props, validators } from './props';

/** Upstream `Receipt` — Paper with stock receipt (zig tears both ends by
    default), no rules, the typed font and the till-roll line layout. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    edgeSpec: {},
  },
  lifetimes: {
    attached() {
      this.__update();
    },
  },
  observers: {
    ends(_e) {
      this.__update();
    },
  },
  methods: {
    __update() {
      const d = this.data;
      const ends = validators.ends.includes(d.ends) ? d.ends : 'zig';
      // Paper's edge takes a per-side object; both ends share the cut.
      this.setData({ edgeSpec: { top: ends, bottom: ends } });
    },
  },
});
