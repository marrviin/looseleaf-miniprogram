import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { props } from './props';

// The upstream title is set in the script font (Kevin Sans with size-adjust);
// the family must be registered before any of it renders.
ensureHandFont();

/** Upstream `Empty` — what a page says when there is nothing on it yet: a
    centered column (gap 6, p 6) of media, title, description and action.
    `framed` swaps the CSS border for the sketched dashed frame with corner
    ticks (empty-frame recipe) drawn at the element's real size. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    // Ink only when framed — the recipe is attached conditionally, like
    // upstream's `framed ? hostRef : undefined`.
    llInkRecipe: '',
    // Root class is .ll-empty, not .ll-<recipe-id>.
    llInkSelector: '.ll-empty',
  },
  lifetimes: {
    attached() {
      this.__applyFramed();
    },
  },
  observers: {
    framed() {
      this.__applyFramed();
    },
  },
  methods: {
    __applyFramed() {
      const want = this.data.framed ? 'empty-frame' : '';
      if (this.data.llInkRecipe !== want) this.setData({ llInkRecipe: want });
      if (want) setTimeout(() => this.__measureInk(), 60);
    },
  },
});
