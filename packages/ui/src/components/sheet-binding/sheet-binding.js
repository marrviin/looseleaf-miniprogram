import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';

ensureHandFont();

/** ll-sheet-binding — the coils or binder holes along the sheet's inner
    edge (upstream SheetBinding, sheetBindingRecipe). Fixed 28px strip on
    the given edge; the coils bleed 26px past the paper onto the dimmed
    page, so the paper root must not clip. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    /** Edge of the PAPER the binding sits on (the side facing the middle). */
    edge: {
      type: String,
      value: 'left',
    },
    kind: {
      type: String,
      value: 'spiral',
    },
    seed: {
      type: null,
      optionalTypes: [String, Number],
      value: '',
    },
    customStyle: String,
  },
  data: {
    llInkRecipe: 'sheet-binding',
    llInkSelector: '.ll-sheet-binding',
  },
  observers: {
    'edge, kind, seed'() {
      this.__measureInk();
    },
  },
  methods: {
    __inkParams() {
      return { edge: this.data.edge, kind: this.data.kind };
    },
  },
});
