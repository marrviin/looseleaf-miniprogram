import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `CollapsibleContent` — folds with a height animation (300ms
    ease-out). The webview can't animate to `auto`, so the content height is
    measured once laid out and the fold animates between 0 and that height.
    `bracket` draws a margin bracket (margin-bracket recipe) that soaks in
    when opened. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    open: false,
    height: '0px',
    llInkRecipe: '',
    llInkSelector: '.ll-collapsible-content__bracket',
    inkStyle: '',
  },
  relations: {
    '../collapsible/collapsible': { type: 'ancestor' },
  },
  observers: {
    bracket(v) {
      const kind = v === true ? 'square' : v || '';
      if (kind) {
        this.setData({ llInkRecipe: 'margin-bracket', bracketKind: kind });
        this.__inkParams = { kind };
        setTimeout(() => this.__measureInk && this.__measureInk(), 0);
      } else if (this.data.llInkRecipe) {
        this.setData({ llInkRecipe: '', inkStyle: '' });
      }
    },
  },
  lifetimes: {
    attached() {
      // Start folded if the root says closed.
      setTimeout(() => this.__measure(), 60);
    },
    detached() {
      if (this.__measureTimer) clearTimeout(this.__measureTimer);
    },
  },
  methods: {
    __onRoot({ open }) {
      if (open === this.data.open) return;
      this.__applyOpen(open);
    },
    __applyOpen(open) {
      this.setData({ open });
      // Re-measure on every toggle: content may have changed while folded.
      this.__measure(() => {
        if (open) {
          this.setData({ height: this.__contentH ? `${this.__contentH}px` : 'auto' });
        } else if (this.__contentH) {
          // Snap to the natural height first so the fold animates down.
          this.setData({ height: `${this.__contentH}px` });
          setTimeout(() => this.setData({ height: '0px' }), 20);
        } else {
          this.setData({ height: '0px' });
        }
      });
    },
    /** Measure the natural height of the fold's content. */
    __measure(done) {
      this.createSelectorQuery()
        .select('.ll-collapsible-content__inner')
        .boundingClientRect((rect) => {
          if (rect && rect.height) this.__contentH = rect.height;
          done && done();
        })
        .exec();
    },
  },
});
