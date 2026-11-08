import { createComponent } from '../../common/component';

/** Upstream `TableCell` — a table-cell (td): padded 12px, nowrap. The
    ruled line under it is the nested rule view (outer fade mask ∘ inner
    tile mask); the row pushes offset/direction through __onRow. A cell
    holding a checkbox loses its end padding upstream (:has selector,
    unsupported here) — pass custom-style="padding-right:0". */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
  relations: {
    '../table-row/table-row': { type: 'ancestor' },
  },
  data: {
    cellStyle: '',
    ruleCls: '',
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
