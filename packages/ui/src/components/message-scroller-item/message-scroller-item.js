import { createComponent } from '../../common/component';
import { props } from './props';

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  relations: {
    '../message-scroller-viewport/message-scroller-viewport': {
      type: 'ancestor',
    },
  },
  observers: {
    scrollAnchor(anchor) {
      if (anchor && this.data.messageId) {
        const vp = this.getRelationNodes('../message-scroller-viewport/message-scroller-viewport')[0];
        if (vp) vp.__requestAnchor(this.data.messageId);
      }
    },
  },
  methods: {
    /** The viewport anchors by rects (scroll-top outranks
        scroll-into-view), so the item measures itself on request. */
    __rect() {
      return new Promise((resolve) => {
        this.createSelectorQuery()
          .select('.ll-message-scroller-item')
          .boundingClientRect()
          .exec((res) => resolve(res && res[0]));
      });
    },
  },
});
