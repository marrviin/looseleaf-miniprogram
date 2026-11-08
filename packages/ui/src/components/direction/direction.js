import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `DirectionProvider` — hands a dir ('ltr' | 'rtl') to everything
    below it. Minimal provider stub: the webview has no ink context or DOM
    attribute cascade, so descendants opt in through the relation and read
    `data.dir`. No component consumes it yet (kept for parity + future D11+). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {},
  relations: {
    './direction-consumer': {
      type: 'descendant',
    },
  },
  observers: {
    dir() {
      this.__push();
    },
  },
  lifetimes: {
    attached() {
      this.__push();
    },
  },
  methods: {
    __push() {
      (this.getRelationNodes('./direction-consumer') || []).forEach((n) => n.__onDirection && n.__onDirection({ dir: this.data.dir }));
    },
    getDirection() {
      return this.data.dir;
    },
  },
});
