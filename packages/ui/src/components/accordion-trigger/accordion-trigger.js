import { createComponent } from '../../common/component';
import { props } from './props';
import { ensureHandFont } from '../../common/hand-font';

/** Upstream `AccordionTrigger` — the row's button: bold hand text, a
    chevron that turns over when open, highlighter swipe on touch (the
    pointer-hover equivalent). */
ensureHandFont();
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'accordion-trigger',
    llInkSelector: '.ll-accordion-trigger',
    open: false,
    rowDisabled: false,
  },
  relations: {
    '../accordion-item/accordion-item': {
      type: 'ancestor',
      linked(parent) {
        this.__item = parent;
      },
      unlinked() {
        this.__item = null;
      },
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({ disabled: this.data.rowDisabled });
    },
  },
  methods: {
    /** The row item pushes open/disabled. */
    __onItem(state) {
      this.__inkParams = () => ({ disabled: state.rowDisabled });
      this.setData({ open: state.open, rowDisabled: state.rowDisabled });
      setTimeout(() => this.__measureInk(), 60);
    },
    onTap() {
      if (this.data.rowDisabled) return;
      if (this.__item) this.__item.__onTriggerTap();
      this.triggerEvent('tap', {});
    },
    /** Touch shows the highlighter swipe (upstream: hover wipe). */
    onTouchStart() {
      if (this.data.rowDisabled) return;
      this.setData({ hovered: true });
    },
    onTouchEnd() {
      if (this.data.hovered) this.setData({ hovered: false });
    },
  },
});
