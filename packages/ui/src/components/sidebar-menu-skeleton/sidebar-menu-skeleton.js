import { createComponent } from '../../common/component';
import { hashSeed } from '../../common/ink';
import { props } from './props';

/** ll-sidebar-menu-skeleton — upstream `SidebarMenuSkeleton`: a loading row
    of pencil hatch. Its width derives from the seed (50–90%), not from a
    random number, so the same props always render the same row. */
createComponent({
  options: { styleIsolation: 'isolated', virtualHost: true },
  properties: props,
  data: {
    width: '50%',
  },
  lifetimes: {
    attached() {
      this.__adopt();
    },
  },
  observers: {
    seed() {
      this.__adopt();
    },
  },
  methods: {
    __adopt() {
      const id = String(this.data.seed ?? '') || 'll-sidebar-skeleton';
      const width = 50 + (hashSeed(id) % 41);
      this.setData({ width: width + '%' });
    },
  },
});
