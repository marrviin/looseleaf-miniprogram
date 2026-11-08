import { createComponent } from '../../common/component';
import { tableTiles } from '../../common/ink-engine';

/** Upstream `TableRow` — a table-row. The ruled lines are the flat 960px
    repeat-x tiles from tableTiles() (upstream tableCss bakes them into a
    stylesheet): each row pulls a different horizontal offset (--ll-rx) and
    each cell a different one (--ll-cx), so the seams never read as
    printed. The tile/geometry values travel as inherited CSS custom
    properties on the row's inline style; the per-cell offsets and rule
    direction are pushed to the cells through the descendant relation
    (item-family pattern — the structural :nth-child selectors of the
    upstream sheet can't reach across component boundaries here).

    The highlighter swipe is one view behind the cells (z-index -1 inside
    the isolated row): upstream paints it per cell with disjoint cap masks,
    which are the same layers at row scale. WeChat has no :hover, so the
    40% swipe lights while the finger is down. */
const TILES = tableTiles();

/* nth-child(4n+2/3/4) → x offsets (upstream sheet); index is 1-based. */
const RX = [0, 0, -330, -610, -140];
/* per-cell nth-child(5n+2..5) offsets. */
const CX = [0, -173, -419, -71, -617];

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    /** data-state="selected" — the full highlighter swipe. */
    selected: {
      type: Boolean,
      value: false,
    },
    customStyle: String,
  },
  data: {
    role: 'body',
    first: false,
    last: false,
    pressed: false,
    rootStyle: '',
  },
  relations: {
    '../table-header/table-header': { type: 'ancestor' },
    '../table-body/table-body': { type: 'ancestor' },
    '../table-footer/table-footer': { type: 'ancestor' },
    '../table-head/table-head': {
      type: 'descendant',
      linked() {
        this.__schedule();
      },
      unlinked() {
        this.__schedule();
      },
    },
    '../table-cell/table-cell': {
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
    /** Called by the section once its rows are counted. */
    __onSection(ctx) {
      this.__ctx = ctx;
      this.setData({ role: ctx.role, first: ctx.first, last: ctx.last });
      this.__schedule();
    },
    __schedule() {
      if (this.__t) return;
      this.__t = setTimeout(() => this.__apply(), 0);
    },
    __apply() {
      const ctx = this.__ctx || { role: 'body', index: 0 };
      const role = ctx.role;
      const idx = ctx.index + 1; // 1-based, like the upstream nth-child math
      // A row holds either heads (header) or cells (body/footer).
      const nodes =
        this.getRelationNodes('../table-head/table-head') ||
        [];
      const list = nodes.length
        ? nodes
        : this.getRelationNodes('../table-cell/table-cell') || [];

      const img = role === 'body' ? TILES.rule : TILES.head;
      const h = role === 'body' ? 8 : 12;
      const color = role === 'body' ? 'var(--ll-pencil-mark)' : 'var(--ll-ink-soft)';
      const ruleB = role === 'body' ? -4 : -6;
      const rootStyle =
        `--ll-tbl-cap-a:${TILES.capStart};--ll-tbl-cap-b:${TILES.capEnd};` +
        `--ll-tbl-img:${img};--ll-tbl-h:${h}px;--ll-rule-color:${color};--ll-rule-b:${ruleB}px;` +
        `--ll-rx:${RX[idx % 4]}px`;
      this.setData({ rootStyle });

      const hideFor = (i) =>
        (role === 'body' && i === list.length - 1) || (role === 'footer' && idx !== 1);
      list.forEach((c, i) => {
        c.__onRow({
          cx: CX[(i + 1) % 5],
          first: i === 0,
          last: i === list.length - 1,
          hide: hideFor(i),
          top: role === 'footer' && idx === 1,
        });
      });
    },
    onTouchStart() {
      this.setData({ pressed: true });
    },
    onTouchEnd() {
      this.setData({ pressed: false });
    },
  },
});
