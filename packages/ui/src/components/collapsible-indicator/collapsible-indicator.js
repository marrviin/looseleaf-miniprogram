import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `CollapsibleIndicator` — a chevron that turns over when open. */
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
  },
});
