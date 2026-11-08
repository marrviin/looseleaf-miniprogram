import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `DropzoneList` — the accepted files as DropzoneItem rows.
    Default: a plain item per file the root pushes. Page-driven: pass
    `files` and lay your own items out inside (the slot replaces the
    defaults so each row can carry its own status and progress). */

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    rows: [],
    pageDriven: false,
  },
  relations: {
    '../dropzone/dropzone': { type: 'ancestor' },
  },
  observers: {
    files(v) {
      // A passed array (even empty) means the page drives the rows.
      const pageDriven = Array.isArray(v);
      const rows = pageDriven
        ? v.map((f, i) => ({ ...f, key: `${f.name}-${f.size}-${i}` }))
        : this.data.rows;
      this.setData({ pageDriven, rows });
    },
  },
  methods: {
    __onDropzone({ files }) {
      if (this.data.pageDriven) return;
      const rows = (files || []).map((f, i) => ({ ...f, key: `${f.name}-${f.size}-${i}` }));
      if (rows.length !== this.data.rows.length || JSON.stringify(rows) !== JSON.stringify(this.data.rows)) {
        this.setData({ rows });
      }
    },
  },
});
