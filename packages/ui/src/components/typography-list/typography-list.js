import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream typography List — hand-drawn markers. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    indexes: [],
  },
  observers: {
    items(items) {
      this.setData({ indexes: (items || []).map((_, i) => i + 1) });
    },
  },
});
