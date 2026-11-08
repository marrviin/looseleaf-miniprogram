import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `CarouselContent` — the clipping viewport + translating flex
    track. The pitch (slide width + 16px gap) is measured from the first
    item — slot content is invisible to this component's own query, so the
    items measure themselves through the relation. A touch swipe past 40px
    advances (keyboard/drag plugins are web-only). */
const GAP = 16;
const SWIPE = 40;

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    orientation: 'horizontal',
    offset: 0,
    animating: false,
  },
  relations: {
    '../carousel/carousel': { type: 'ancestor' },
    '../carousel-item/carousel-item': { type: 'descendant' },
  },
  lifetimes: {
    attached() {
      // First layout, then measure (a 0-width first pass is normal).
      this.__retapes = 0;
      setTimeout(() => this.__measure(), 50);
    },
  },
  methods: {
    __onCarousel({ index, orientation }) {
      this.setData({ orientation });
      this.__index = index;
      this.__measure();
    },
    /** Slide width (horizontal) or height (vertical) from the first item. */
    __measure() {
      const items = this.getRelationNodes('../carousel-item/carousel-item') || [];
      const first = items[0];
      if (!first || !first.__size) return;
      first.__size().then((rect) => {
        if (!rect || (!rect.width && !rect.height)) {
          const n = (this.__retapes = (this.__retapes || 0) + 1);
          if (n < 40) setTimeout(() => this.__measure(), n <= 10 ? 60 : 250);
          return;
        }
        this.__retapes = 0;
        const pitch = (this.data.orientation === 'vertical' ? rect.height : rect.width) + GAP;
        const offset = -(this.__index || 0) * pitch;
        if (offset !== this.data.offset) this.setData({ offset });
      });
    },
    onTouchStart(e) {
      const t = e.touches && e.touches[0];
      this.__start = t ? { x: t.clientX, y: t.clientY } : null;
    },
    onTouchEnd(e) {
      if (!this.__start) return;
      const t = e.changedTouches && e.changedTouches[0];
      if (!t) return;
      const root = this.getRelationNodes('../carousel/carousel')[0];
      if (!root) return;
      if (this.data.orientation === 'vertical') {
        if (t.clientY - this.__start.y < -SWIPE) root.scrollNext();
        else if (t.clientY - this.__start.y > SWIPE) root.scrollPrev();
      } else if (t.clientX - this.__start.x < -SWIPE) root.scrollNext();
      else if (t.clientX - this.__start.x > SWIPE) root.scrollPrev();
      this.__start = null;
    },
  },
});
