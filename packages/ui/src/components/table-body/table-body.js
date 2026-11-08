import { createComponent } from '../../common/component';

/** Upstream `TableBody` — a table-row-group; rows are ruled by hand and
    the last one is left open (the row's rule logic reads `last`). */
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
          r.__onSection({ role: 'body', index: i, first: i === 0, last: i === rows.length - 1 })
        );
      }, 0);
    },
  },
});
