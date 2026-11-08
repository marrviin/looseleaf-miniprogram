import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Alert` — the alertRecipe draws the box (wash, icon mark, felt
    outline) per tone; `note` is instead a sticky-yellow Paper with a tape
    corner, and the recipe draws nothing. Title/description come through
    the slot as ll-alert-title / ll-alert-description. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  externalClasses: [],
  properties: props,
  data: {
    isNote: false,
    paperSeed: '',
  },
  observers: {
    variant(v) {
      this.__applyVariant(v);
    },
  },
  methods: {
    __applyVariant(v) {
      const isNote = v === 'note';
      const patch = { isNote };
      // The Paper branch keeps the ink machinery idle.
      patch.llInkRecipe = isNote ? '' : 'alert';
      patch.paperSeed = `${this.data.seed || ''}`;
      if (isNote) patch.inkStyle = '';
      this.setData(patch);
      if (!isNote) {
        this.__inkParams = { tone: v };
        setTimeout(() => {
          this.__measureInk && this.__measureInk();
          this.__push();
        }, 0);
      } else {
        this.__push();
      }
    },
    __push() {
      const nodes = [
        ...(this.getRelationNodes('../alert-title/alert-title') || []),
        ...(this.getRelationNodes('../alert-description/alert-description') || []),
      ];
      for (const n of nodes) n.__onAlert && n.__onAlert({ variant: this.data.variant });
    },
  },
  relations: {
    '../alert-title/alert-title': {
      type: 'descendant',
    },
    '../alert-description/alert-description': {
      type: 'descendant',
    },
  },
  lifetimes: {
    attached() {
      this.__applyVariant(this.data.variant);
    },
  },
});
