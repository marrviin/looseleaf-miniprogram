import { createComponent } from '../../common/component';
import { props } from './props';

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  relations: {
    '../bubble/bubble': {
      type: 'descendant',
      linked() {
        setTimeout(() => this.__sync(), 0);
      },
      unlinked() {
        setTimeout(() => this.__sync(), 0);
      },
    },
  },
  methods: {
    __sync() {
      const bubbles = this.getRelationNodes('../bubble/bubble') || [];
      bubbles.forEach((b, i) => b.__onGroup({ last: i === bubbles.length - 1 }));
    },
  },
});
