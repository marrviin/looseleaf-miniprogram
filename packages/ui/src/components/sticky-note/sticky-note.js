import { createComponent } from '../../common/component';
import { props, validators } from './props';

/** Upstream `StickyNote` — Paper with stock sticky-<color> plus a
    font-script label layout, and (when `done` is set) a tick box drawn by
    the sticky-note-decor recipe: a pencil box top-right whose felt tick
    appears in the checked layer. Pressing the box fires `donchange` (the
    tick's draw-on animation is a CSS mask effect upstream; the checked
    layer shows it complete here). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'sticky-note-decor',
    llInkSelector: '.ll-sticky-note-decor',
    tickable: false,
    colorName: 'yellow',
  },
  lifetimes: {
    attached() {
      this.__update();
    },
  },
  observers: {
    'color, done'() {
      this.__update();
    },
  },
  methods: {
    __update() {
      const d = this.data;
      const colorName = validators.color.includes(d.color) ? d.color : 'yellow';
      const tickable = d.done === true || d.done === false;
      this.setData({
        colorName,
        tickable,
        checked: tickable && d.done === true,
      });
    },
    toggleDone() {
      if (!this.data.tickable) return;
      const done = !this.data.done;
      this.triggerEvent('donchange', { done });
    },
  },
});
