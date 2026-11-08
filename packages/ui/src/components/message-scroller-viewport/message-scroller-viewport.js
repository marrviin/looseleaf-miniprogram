import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `MessageScrollerViewport` — the scrolling region. scroll-view
    carries the scroll; the component tracks the edges, follows the bottom
    while autoScroll + following (a 250ms height watch — scroll-view can't
    observe content growth), and takes anchors from the items. The page-edge
    fades render as paper-gradient overlays (the CSS mask upstream uses
    would clip on the scroll view). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    scrollTop: 0,
    fadeTop: false,
    fadeBottom: false,
  },
  relations: {
    '../message-scroller/message-scroller': {
      type: 'ancestor',
    },
    '../message-scroller-item/message-scroller-item': {
      type: 'descendant',
    },
  },
  lifetimes: {
    attached() {
      this.__config = { autoScroll: false, defaultScrollPosition: 'end', threshold: 8 };
      this.__following = true;
      this.__lastHeight = 0;
      // Open on the newest message (defaultScrollPosition).
      setTimeout(() => this.__scrollToEndNow(true), 80);
      this.__startWatch();
    },
    detached() {
      if (this.__watchTimer) clearInterval(this.__watchTimer);
    },
  },
  methods: {
    /** From the root: the provider config. */
    __onConfig(config) {
      const wasAuto = this.__config && this.__config.autoScroll;
      this.__config = config;
      if (config.autoScroll && !wasAuto) this.__scrollToEndNow();
    },
    __measure() {
      return new Promise((resolve) => {
        this.createSelectorQuery()
          .select('.ll-message-scroller-viewport__scroller')
          .scrollOffset()
          .select('.ll-message-scroller-viewport__scroller')
          .boundingClientRect()
          .exec((res) => {
            const off = res && res[0];
            const rect = res && res[1];
            resolve({
              top: off ? off.scrollTop : 0,
              height: off ? off.scrollHeight : 0,
              viewH: rect ? rect.height : 0,
            });
          });
      });
    },
    async __applyEdges() {
      const m = await this.__measure();
      const th = (this.__config && this.__config.threshold) || 8;
      const atStart = m.top <= th;
      const atEnd = m.viewH ? m.height - m.top - m.viewH <= th : false;
      this.__following = atEnd;
      this.__lastHeight = m.height;
      if (atStart !== this.data.fadeTop || atEnd !== this.data.fadeBottom) {
        this.setData({ fadeTop: !atStart, fadeBottom: !atEnd });
      }
      const scroller = this.getRelationNodes('../message-scroller/message-scroller')[0];
      if (scroller) scroller.__onScrollable({ start: !atStart, end: !atEnd });
    },
    onScroll() {
      this.__applyEdges();
    },
    /** Follow the bottom while content grows (autoScroll + still following). */
    __startWatch() {
      if (this.__watchTimer) return;
      this.__watchTimer = setInterval(async () => {
        if (!this.__config || !this.__config.autoScroll || !this.__following) return;
        const m = await this.__measure();
        if (m.height !== this.__lastHeight) {
          this.__lastHeight = m.height;
          this.setData({ scrollTop: m.height });
        }
      }, 250);
    },
    __scrollToEndNow() {
      this.__measure().then((m) => {
        this.__lastHeight = m.height;
        this.setData({ scrollTop: m.height + 1000 });
      });
    },
    scrollToEnd() {
      this.__scrollToEndNow();
      return true;
    },
    scrollToStart() {
      this.setData({ scrollTop: 0 });
      return true;
    },
    /** Bring the message with this id to the top of the view. scroll-top is
        bound on the scroll-view, so scroll-into-view would lose the race —
        anchor by measured rects instead: the item measures itself, we turn
        the delta into a scroll-top. */
    scrollToMessage(id) {
      return this.__scrollToItem(id);
    },
    /** From an item with scrollAnchor: pin it to the top when it arrives. */
    __requestAnchor(id) {
      return this.__scrollToItem(id);
    },
    __scrollToItem(id) {
      const items = this.getRelationNodes('../message-scroller-item/message-scroller-item') || [];
      const item = items.filter((n) => n.data.messageId === id)[0];
      if (!item || !item.__rect) return false;
      item.__rect().then((rect) => {
        if (!rect) return;
        this.createSelectorQuery()
          .select('.ll-message-scroller-viewport__scroller')
          .boundingClientRect()
          .exec((res) => {
            const sc = res && res[0];
            if (!sc) return;
            const target = Math.max(0, this.data.scrollTop + (rect.top - sc.top));
            this.setData({ scrollTop: target });
          });
      });
      return true;
    },
  },
});
