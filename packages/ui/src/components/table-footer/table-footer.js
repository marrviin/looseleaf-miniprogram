import { createComponent } from '../../common/component';

/** Upstream `TableFooter` — a table-footer-group; bold text, and the
    double rule turned upside down above the first row. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
  relations: {
    '../table-row/table-row': {
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
      if (this.__t) return;
      this.__t = setTimeout(() => {
        this.__t = null;
        const rows = this.getRelationNodes('../table-row/table-row') || [];
        rows.forEach((r, i) =>
          r.__onSection({ role: 'footer', index: i, first: i === 0, last: i === rows.length - 1 })
        );
      }, 0);
    },
  },
});
