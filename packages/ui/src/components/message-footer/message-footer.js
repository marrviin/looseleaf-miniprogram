import { createComponent } from '../../common/component';
import { props } from './props';

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    isEnd: false,
  },
  relations: {
    '../message/message': {
      type: 'ancestor',
    },
  },
  methods: {
    __onMessage({ align }) {
      const isEnd = align === 'end';
      if (isEnd !== this.data.isEnd) this.setData({ isEnd });
    },
  },
});
