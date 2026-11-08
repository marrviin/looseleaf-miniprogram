import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `MessageScrollerButton` — inert while there is nowhere to jump. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    active: false,
  },
  relations: {
    '../message-scroller/message-scroller': {
      type: 'ancestor',
    },
  },
  methods: {
    __onScroller({ start, end }) {
      const active = this.data.direction === 'end' ? end : start;
      if (active !== this.data.active) this.setData({ active });
    },
    onTap() {
      const scroller = this.getRelationNodes('../message-scroller/message-scroller')[0];
      if (!scroller) return;
      if (this.data.direction === 'end') scroller.scrollToEnd();
      else scroller.scrollToStart();
    },
  },
});
