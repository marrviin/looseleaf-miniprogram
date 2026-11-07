import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `ItemGroup` — a role=list column of rows. Isolated component
    styles can't cross the group→row boundary, so `ruled` is pushed to each
    item through the relation and the rows draw their own blue rule. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  relations: {
    '../item/item': {
      type: 'descendant',
      linked(child) {
        (this.__items = this.__items || []).push(child);
        setTimeout(() => child.__onGroup({ ruled: this.data.ruled }), 0);
      },
      unlinked(child) {
        this.__items = (this.__items || []).filter((i) => i !== child);
      },
    },
  },
  observers: {
    ruled() {
      (this.__items || []).forEach((i) => i.__onGroup({ ruled: this.data.ruled }));
    },
  },
});
