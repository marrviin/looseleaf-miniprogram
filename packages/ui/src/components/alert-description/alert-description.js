import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `AlertDescription` — muted copy under the title. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    variant: 'default',
  },
  relations: {
    '../alert/alert': {
      type: 'ancestor',
    },
  },
  methods: {
    __onAlert({ variant }) {
      if (variant !== this.data.variant) this.setData({ variant });
    },
  },
});
