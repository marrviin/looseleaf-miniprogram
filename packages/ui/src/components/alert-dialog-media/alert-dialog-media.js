import { createComponent } from '../../common/component';

/** ll-alert-dialog-media — the picture beside the question: an icon (or any
    art) sitting on a hand-drawn round patch. The patch is the alert-media
    recipe at a fixed 64x64 plate; tone picks the wash: highlighter (default),
    red pencil (danger), sky (info). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    /** '"default" | "danger" | "info"'. */
    tone: {
      type: String,
      value: 'default',
    },
    customStyle: String,
  },
  data: {
    llInkRecipe: 'alert-media',
    llInkSelector: '.ll-alert-dialog-media__patch',
  },
  observers: {
    tone() {
      // The tone picks the wash — re-run the recipe with new params.
      if (typeof this.__measureInk === 'function') this.__measureInk();
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({ tone: this.data.tone });
    },
  },
});
