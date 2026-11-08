import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-sidebar-menu — upstream `SidebarMenu`: the list (ul) of rows. Items
    register through the descendant relation; on every link/unlink the rows
    are re-indexed and each hears its position (the pad's ruling line masks
    alternate odd/even, so the lines look hand-laid, not stamped). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  relations: {
    '../sidebar-menu-item/sidebar-menu-item': {
      type: 'descendant',
      linked() {
        this.__schedule();
      },
      unlinked() {
        this.__schedule();
      },
    },
  },
  methods: {
    __schedule() {
      if (this.__scheduled) return;
      this.__scheduled = true;
      setTimeout(() => {
        this.__scheduled = false;
        this.__sync();
      }, 0);
    },
    __sync() {
      (this.getRelationNodes('../sidebar-menu-item/sidebar-menu-item') || []).forEach((c, i) => {
        c.__onMenu && c.__onMenu(i);
      });
    },
  },
});
