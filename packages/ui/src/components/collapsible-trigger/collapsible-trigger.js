import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `CollapsibleTrigger` — toggles the root. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    open: false,
  },
  relations: {
    '../collapsible/collapsible': { type: 'ancestor' },
  },
  methods: {
    __onRoot({ open }) {
      if (open !== this.data.open) this.setData({ open });
    },
    onTap() {
      const root = this.getRelationNodes('../collapsible/collapsible')[0];
      if (root) root.toggle();
      this.triggerEvent('toggle');
    },
  },
});
