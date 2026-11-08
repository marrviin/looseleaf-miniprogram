import { createComponent } from '../../common/component';

/** Upstream `TableHead` — a table-cell (th): column names in the script
    font, blue felt. `sort` mirrors aria-sort ("none" | "ascending" |
    "descending") — sorted labels turn to ink. The ruled line under it is
    the nested rule view (outer fade mask ∘ inner tile mask — nesting
    stands in for upstream's mask-composite: intersect). The row pushes
    offset/direction through __onRow. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    sort: {
      type: String,
      value: 'none',
    },
    customStyle: String,
  },
  relations: {
    '../table-row/table-row': { type: 'ancestor' },
  },
  data: {
    sorted: false,
    cellStyle: '',
    ruleCls: '',
  },
  observers: {
    sort(sort) {
      this.setData({ sorted: sort === 'ascending' || sort === 'descending' });
    },
  },
  methods: {
    __onRow(cfg) {
      this.setData({
        cellStyle: `--ll-cx:${cfg.cx}px`,
        ruleCls: cfg.hide
          ? 'll-cell-rule--hide'
          : [
              cfg.top ? 'll-cell-rule--top' : '',
              cfg.first && cfg.last ? 'll-cell-rule--fse' : cfg.first ? 'll-cell-rule--fs' : cfg.last ? 'll-cell-rule--fe' : '',
            ]
              .join(' ')
              .trim(),
      });
    },
  },
});
