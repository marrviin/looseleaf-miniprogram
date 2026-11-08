import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `EnvelopeLetter` — the letter tucked behind the envelope's
    front: an ll-paper that slides up out of the slot when the envelope
    opens. Registers with the parent ll-envelope for the open state. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    open: false,
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
    __onEnvelope(ctx) {
      this.setData({ open: !!ctx.open });
    },
  },
});
