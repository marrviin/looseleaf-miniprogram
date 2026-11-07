import { createComponent } from '../../common/component';
import { props, validators } from './props';

/** Upstream `Napkin` — Paper with stock napkin (crimped edge) plus the
    napkin-decor recipe: fold creases (quarter folds both ways, half one
    way) and an optional coffee ring, drawn on the paper box. The decor is
    disabled for a flat, unstained napkin (fold="none" stain off). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'napkin-decor',
    llInkSelector: '.ll-napkin-decor',
    decorOn: true,
    foldName: 'quarter',
  },
  lifetimes: {
    attached() {
      this.__update();
    },
  },
  observers: {
    'fold, stain'() {
      this.__update();
    },
  },
  methods: {
    __update() {
      const d = this.data;
      const foldName = validators.fold.includes(d.fold) ? d.fold : 'quarter';
      const stain = !!d.stain;
      // enabled: fold !== 'none' || stain (upstream usePaperDecor)
      this.__inkParams = { fold: foldName, stain };
      this.setData({
        foldName,
        decorOn: foldName !== 'none' || stain,
      });
      this.__measureInk();
    },
  },
});
