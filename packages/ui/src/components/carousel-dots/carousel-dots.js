import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `CarouselDots` — pencil ticks, one per slide; every fifth tick
    is the long slash that finishes the group of five. Hidden below two
    slides. */
const GROUP = 5;

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    index: 0,
    count: 0,
    groups: [],
  },
  relations: {
    '../carousel/carousel': { type: 'ancestor' },
  },
  observers: {
    'index, count'(index, count) {
      const groups = [];
      const n = Math.ceil(count / GROUP);
      for (let g = 0; g < n; g++) {
        const ticks = [];
        for (let k = 0; k < Math.min(GROUP, count - g * GROUP); k++) {
          const i = g * GROUP + k;
          ticks.push({ i, slash: i % GROUP === GROUP - 1 });
        }
        groups.push(ticks);
      }
      this.setData({ groups });
    },
  },
  methods: {
    __onCarousel({ index, count }) {
      this.setData({ index, count });
    },
    scrollTo(e) {
      const root = this.getRelationNodes('../carousel/carousel')[0];
      if (root) root.scrollTo(e.currentTarget.dataset.i);
    },
  },
});
