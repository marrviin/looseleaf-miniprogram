import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `CarouselContent` — the clipping viewport + translating flex
    track. The pitch (slide width + 16px gap) is measured from the first
    item — slot content is invisible to this component's own query, so the
    items measure themselves through the relation. A touch swipe past 40px
    advances (keyboard/drag plugins are web-only). */
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
    /** Slide width (horizontal) or height (vertical) from the first item,
        plus the viewport's own box for the end clamp (upstream embla's
        containScroll:'trimSnaps': the last snaps pull the track's end
        flush to the viewport's far edge instead of trailing blank). */
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
        const vertical = this.data.orientation === 'vertical';
        // the gap rides inside the slide (ps-4), so the pitch IS the slide box
        const pitch = vertical ? rect.height : rect.width;
        const count = items.length;
        this.createSelectorQuery()
          .select('.ll-carousel-content')
          .boundingClientRect((view) => {
            const span = (vertical ? view.height : view.width) || 0;
            const total = count * pitch;
            const maxScroll = Math.max(0, total - span);
            const offset = -Math.min((this.__index || 0) * pitch, maxScroll);
            if (offset !== this.data.offset) this.setData({ offset });
          })
          .exec();
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
