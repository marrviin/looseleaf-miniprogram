import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-sidebar-inset — upstream `SidebarInset`: the page beside the pad.
    With variant="inset" it is a sheet of paper on the desk from the md
    breakpoint up (with margins that follow the pad's state); the phone and
    other variants keep it plain. The provider relays the pad's variant and
    state over (upstream's peer-data selectors). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    variant: 'sidebar',
    state: 'expanded',
    isMobile: true,
  },
  methods: {
    __onProvider(ctx) {
      this.setData({ variant: ctx.variant || 'sidebar', state: ctx.state || 'expanded', isMobile: !!ctx.isMobile });
    },
  },
});
