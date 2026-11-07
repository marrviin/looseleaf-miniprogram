import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `TabsContent` — the panel. Inactive panels unmount (Radix's
    default without forceMount). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    active: false,
  },
  relations: {
    '../tabs/tabs': {
      type: 'ancestor',
      linked(parent) {
        setTimeout(() => parent.__sync(), 0);
      },
    },
  },
  methods: {
    /** ll-tabs root syncs the active panel. */
    __onGroup(ctx) {
      const active = ctx.value === this.data.value && ctx.value !== '';
      if (active !== this.data.active) this.setData({ active });
    },
  },
});
