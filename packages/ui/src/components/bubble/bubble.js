import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Bubble` — resolves align (own prop ?? enclosing Message) and
    tail (own prop ?? last-in-BubbleGroup), then pushes the state its
    BubbleContent draws from. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    alignNow: 'start',
    tailOn: true,
  },
  relations: {
    '../bubble-content/bubble-content': {
      type: 'descendant',
      linked(child) {
        (this.__contents = this.__contents || []).push(child);
      },
      unlinked(child) {
        this.__contents = (this.__contents || []).filter((c) => c !== child);
      },
    },
    '../bubble-group/bubble-group': {
      type: 'ancestor',
    },
    '../message/message': {
      type: 'ancestor',
    },
  },
  observers: {
    'variant, align, shape, pen, tail'() {
      this.__push();
    },
  },
  lifetimes: {
    attached() {
      setTimeout(() => this.__push(), 0);
    },
  },
  methods: {
    /** From the BubbleGroup: whether this is the last bubble (tail keeper). */
    __onGroup({ last }) {
      this.__last = last;
      this.__push();
    },
    /** From the enclosing Message: the row alignment bubbles inherit. */
    __onMessageAlign(align) {
      this.__messageAlign = align;
      this.__push();
    },
    __push() {
      const d = this.data;
      const alignNow = d.align || this.__messageAlign || 'start';
      const tailOn = d.tail && this.__last !== false;
      if (alignNow !== d.alignNow || tailOn !== d.tailOn) this.setData({ alignNow, tailOn });
      const ctx = { variant: d.variant, align: alignNow, shape: d.shape, pen: d.pen, tailOn };
      (this.__contents || []).forEach((c) => c.__onBubble(ctx));
    },
  },
});
