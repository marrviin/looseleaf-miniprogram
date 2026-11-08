import { createComponent } from '../../common/component';
import { props } from './props';

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    lifted: false,
  },
  relations: {
    '../message/message': {
      type: 'ancestor',
    },
  },
  methods: {
    __onMessage({ hasFooter }) {
      if (!!hasFooter !== this.data.lifted) this.setData({ lifted: !!hasFooter });
    },
  },
});
