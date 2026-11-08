import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `CarouselPrevious` — the jump button; disabled at the edge. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    orientation: 'horizontal',
    disabled: false,
  },
  relations: {
    '../carousel/carousel': { type: 'ancestor' },
  },
  methods: {
    __onCarousel({ index, count: _count, orientation }) {
      const disabled = index <= 0;
      this.setData({ orientation, disabled });
    },
    onTap() {
      const root = this.getRelationNodes('../carousel/carousel')[0];
      if (root) root.scrollPrevious();
    },
  },
});
