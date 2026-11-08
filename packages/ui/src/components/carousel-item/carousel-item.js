import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `CarouselItem` — a full-width slide. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  relations: {
    '../carousel/carousel': { type: 'ancestor' },
    '../carousel-content/carousel-content': { type: 'ancestor' },
  },
  data: {
    orientation: 'horizontal',
  },
  methods: {
    __onCarousel({ orientation }) {
      if (orientation !== this.data.orientation) this.setData({ orientation });
    },
    /** The content measures the pitch from the first slide. */
    __size() {
      return new Promise((resolve) => {
        this.createSelectorQuery()
          .select('.ll-carousel-item')
          .boundingClientRect()
          .exec((res) => resolve(res && res[0]));
      });
    },
  },
  lifetimes: {
    attached() {
      const root = this.getRelationNodes('../carousel/carousel')[0];
      if (root) root.__onItem('add');
    },
    detached() {
      const root = this.getRelationNodes('../carousel/carousel')[0];
      if (root) root.__onItem('remove');
    },
  },
});
