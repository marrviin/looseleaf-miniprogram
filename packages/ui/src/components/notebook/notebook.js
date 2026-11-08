import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Notebook` — a Paper (ruled by default) with the binding drawn
    over its start edge (the notebook decor recipe, napkin pattern). Pages
    are ll-notebook-page descendants shown/hidden by value; ll-notebook-turn
    is the corner button that calls turn(to). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  relations: {
    '../notebook-page/notebook-page': {
      type: 'descendant',
      linked(page) {
        this.__pages = this.__pages || [];
        this.__pages.push(page);
        if (this.__ready) this.__broadcast();
      },
      unlinked(page) {
        this.__pages = (this.__pages || []).filter((p) => p !== page);
      },
    },
  },
  properties: props,
  data: {
    llInkRecipe: 'notebook',
    llInkSelector: '.ll-notebook__decor',
    rootClass: 'll-notebook',
    rulesName: 'ruled',
    decorOn: true,
    valueNow: '',
  },
  lifetimes: {
    attached() {
      this.__pages = [];
      this.__update();
    },
    ready() {
      this.__ready = true;
      this.__broadcast();
    },
  },
  observers: {
    'binding, side, pages, tone, curl, rules'() {
      this.__update();
    },
    value(v) {
      // Controlled (value is a string) — mirror it and re-broadcast.
      if (typeof v === 'string' && v !== this.data.valueNow) {
        this.setData({ valueNow: v });
        this.__broadcast();
      }
    },
  },
  methods: {
    __update() {
      const d = this.data;
      const binding = d.binding || 'spiral';
      const side = d.side === 'top' ? 'top' : 'start';
      const pages = Math.max(0, Math.min(3, parseInt(d.pages, 10) || 0));
      const curl = !!d.curl;
      const tone = d.tone || undefined;
      const rules = d.rules || (side === 'top' ? 'pad' : 'ruled');
      this.__inkParams = { binding, side, pages, tone, curl };
      this.setData({
        rootClass: 'll-notebook' + (side === 'top' ? ' ll-notebook--top' : ''),
        rulesName: rules,
        decorOn: binding !== 'none' || pages > 0,
        // Uncontrolled start: defaultValue (a controlled value arrives via
        // the observer).
        valueNow: typeof d.value === 'string' ? d.value : d.defaultValue || '',
      });
      this.__measureInk();
      this.__broadcast();
    },
    /** Public: turn to a named page (upstream ctx.setValue). */
    turn(to) {
      if (typeof this.data.value === 'string' && to !== this.data.value) {
        // Controlled: let the owner move it; we still announce.
        this.triggerEvent('valuechange', { value: to });
        return;
      }
      if (to !== this.data.valueNow) {
        this.setData({ valueNow: to });
        this.triggerEvent('valuechange', { value: to });
        this.__broadcast();
      }
    },
    __broadcast() {
      const now = this.data.valueNow;
      (this.__pages || []).forEach((p) => p.__setActive(!p.data.value || p.data.value === now));
    },
  },
});
