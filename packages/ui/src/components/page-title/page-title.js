import { createComponent } from '../../common/component';

/** Upstream `PageTitle` — a script heading with a hand-drawn mark under it
    (the title-mark recipe: a pen line, two, a wavy one, or a highlighter
    swipe). `as` is not portable — the root is a view with aria-role
    heading. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    /** 'single' | 'double' | 'wavy' | 'highlight' | 'none' */
    underline: {
      type: String,
      value: 'single',
    },
    seed: {
      type: null,
      optionalTypes: [String, Number],
      value: '',
    },
    customStyle: String,
  },
  data: {
    llInkRecipe: 'title-mark',
    llInkSelector: '.ll-page-title',
    drawn: true,
  },
  lifetimes: {
    attached() {
      this.__update();
    },
  },
  observers: {
    underline() {
      this.__update();
    },
  },
  methods: {
    __update() {
      const drawn = this.data.underline !== 'none';
      this.__inkParams = { kind: drawn ? this.data.underline : 'single' };
      this.setData({ drawn });
      this.__measureInk();
    },
  },
});
