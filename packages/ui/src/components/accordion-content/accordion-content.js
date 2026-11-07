import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `AccordionContent` — the panel. Opens without the height
    animation; an opened row writes its margin brace (margin-bracket
    recipe, drawn in this component) beside the text. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'margin-bracket',
    llInkSelector: '.ll-accordion-content__bracket',
    open: false,
    bracket: 'curly',
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
  methods: {
    /** The row item pushes open/bracket. */
    __onItem(state) {
      this.setData({ open: state.open, bracket: state.bracket });
      if (state.open) setTimeout(() => this.__measureInk(), 60);
    },
  },
});
