import { createComponent } from '../../common/component';

/** Upstream `TableHeader` — a table-header-group. Reads `sticky` from the
    enclosing Table (ancestor relation) and hands each row its position
    (the structural :nth-child selectors of the upstream sheet don't reach
    across component boundaries here, so the section drives them). */
const ROLE = 'header';

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
  data: {
    sticky: false,
  },
  relations: {
    '../table/table': {
      type: 'ancestor',
      linked(parent) {
        this.__table = parent;
        this.setData({ sticky: !!parent.data.sticky });
      },
      unlinked() {
        this.__table = null;
        this.setData({ sticky: false });
      },
    },
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
          r.__onSection({ role: ROLE, index: i, first: i === 0, last: i === rows.length - 1 })
        );
      }, 0);
    },
  },
});
