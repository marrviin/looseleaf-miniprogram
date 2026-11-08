import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Carousel` — embla snapped track, redrawn as a translating
    flex track: the root owns the selected index, the content translates by
    slide width + gap, and a touch swipe past 40px advances. Keyboard and
    plugin hooks are web-only (not portable). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    index: 0,
    count: 0,
  },
  relations: {
    '../carousel-content/carousel-content': { type: 'descendant' },
    '../carousel-item/carousel-item': { type: 'descendant' },
    '../carousel-previous/carousel-previous': { type: 'descendant' },
    '../carousel-next/carousel-next': { type: 'descendant' },
    '../carousel-dots/carousel-dots': { type: 'descendant' },
  },
  lifetimes: {
    ready() {
      // Items' attached hooks can't see this root yet (relations land
      // later), so the count is taken authoritatively here from the
      // descendant relation; item add/remove keeps it fresh afterwards.
      const items = this.getRelationNodes('../carousel-item/carousel-item') || [];
      if (items.length !== this.data.count) this.setData({ count: items.length });
      this.__push();
    },
  },
  methods: {
    /** Items register so the dots and edge states know the count. */
    __onItem(action) {
      if (action === 'add') this.setData({ count: this.data.count + 1 });
      else if (action === 'remove') this.setData({ count: Math.max(0, this.data.count - 1) });
      this.__push();
    },
    __push() {
      const { index, count, orientation } = this.data;
      const payload = { index, count, orientation };
      const groups = [
        '../carousel-content/carousel-content',
        '../carousel-item/carousel-item',
        '../carousel-previous/carousel-previous',
        '../carousel-next/carousel-next',
        '../carousel-dots/carousel-dots',
      ];
      for (const rel of groups) {
        for (const n of this.getRelationNodes(rel) || []) {
          n.__onCarousel && n.__onCarousel(payload);
        }
      }
    },
    scrollTo(i) {
      const index = Math.max(0, Math.min(this.data.count - 1, i));
      if (index === this.data.index) return;
      this.setData({ index });
      this.triggerEvent('select', { index });
      this.__push();
    },
    scrollPrev() {
      this.scrollTo(this.data.index - 1);
    },
    scrollNext() {
      this.scrollTo(this.data.index + 1);
    },
  },
});
