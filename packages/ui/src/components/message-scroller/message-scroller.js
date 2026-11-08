import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `MessageScroller` (+ Provider folded in) — coordinates the
    viewport's scrollable state to the jump buttons and forwards the
    scrollTo* calls. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    scrollStart: false,
    scrollEnd: false,
  },
  relations: {
    '../message-scroller-viewport/message-scroller-viewport': {
      type: 'descendant',
      linked(child) {
        this.__viewport = child;
        setTimeout(() => this.__pushConfig(), 0);
      },
      unlinked() {
        this.__viewport = null;
      },
    },
    '../message-scroller-button/message-scroller-button': {
      type: 'descendant',
      linked() {
        setTimeout(() => this.__pushButtons(), 0);
      },
      unlinked() {
        setTimeout(() => this.__pushButtons(), 0);
      },
    },
  },
  observers: {
    'autoScroll, defaultScrollPosition, scrollEdgeThreshold'() {
      this.__pushConfig();
    },
  },
  methods: {
    __pushConfig() {
      const d = this.data;
      if (this.__viewport) {
        this.__viewport.__onConfig({
          autoScroll: d.autoScroll,
          defaultScrollPosition: d.defaultScrollPosition,
          threshold: d.scrollEdgeThreshold,
        });
      }
    },
    /** From the viewport: is there more to scroll toward each edge? */
    __onScrollable({ start, end }) {
      if (start !== this.data.scrollStart || end !== this.data.scrollEnd) {
        this.setData({ scrollStart: start, scrollEnd: end });
      } else {
        return;
      }
      this.__pushButtons();
    },
    __pushButtons() {
      // getRelationNodes over the button relation
      const btns = this.getRelationNodes('../message-scroller-button/message-scroller-button') || [];
      btns.forEach((b) => b.__onScroller({ start: this.data.scrollStart, end: this.data.scrollEnd }));
    },
    scrollToEnd(behavior) {
      return this.__viewport ? this.__viewport.scrollToEnd(behavior) : false;
    },
    scrollToStart(behavior) {
      return this.__viewport ? this.__viewport.scrollToStart(behavior) : false;
    },
    scrollToMessage(id, opts) {
      return this.__viewport ? this.__viewport.scrollToMessage(id, opts) : false;
    },
  },
});
