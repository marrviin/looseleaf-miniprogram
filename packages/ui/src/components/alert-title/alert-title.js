import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `AlertTitle` — bold, one line, sits in the title column. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  relations: {
    '../alert/alert': {
      type: 'ancestor',
    },
  },
  methods: {
    __onAlert() {},
  },
});
