import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `EnvelopeFront` — the face of the envelope: the sealed flap V,
    the perforated stamp and postmark rings, drawn by `envelope-front` ink.
    Registers with the parent ll-envelope for `{ stock, stamp, postmark,
    airmail, seed }`. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'envelope-front',
    llInkSelector: '.ll-envelope-front',
  },
  relations: {
    '../envelope/envelope': {
      type: 'ancestor',
      linked(parent) {
        this.__envelope = parent;
        setTimeout(() => parent.__sync(), 0);
      },
      unlinked() {
        this.__envelope = null;
      },
    },
  },
  methods: {
    /** From the envelope root: what this face is made of. */
    __onEnvelope(ctx) {
      this.__inkParams = {
        stock: ctx.stock,
        stamp: ctx.stamp,
        postmark: ctx.postmark,
        airmail: ctx.airmail,
      };
      this.setData({ seed: `${ctx.seed}|front` });
      setTimeout(() => this.__measureInk(), 60);
    },
  },
});
