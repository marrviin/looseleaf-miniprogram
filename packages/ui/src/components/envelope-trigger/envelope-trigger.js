import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `EnvelopeTrigger` — the invisible tap target over the whole
    envelope (Radix Collapsible.Trigger). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  relations: {
    '../envelope/envelope': {
      type: 'ancestor',
      linked(parent) {
        this.__envelope = parent;
      },
      unlinked() {
        this.__envelope = null;
      },
    },
  },
  methods: {
    __onEnvelope() {},
    onTap() {
      if (this.__envelope) this.__envelope.__onTriggerTap();
    },
  },
});
