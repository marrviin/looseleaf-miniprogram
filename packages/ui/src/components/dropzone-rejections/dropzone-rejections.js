import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `DropzoneRejections` — one red line per refused file with all
    its reasons joined; cleared by the next clean drop (the root pushes
    fresh rejections each add). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    lines: [],
  },
  relations: {
    '../dropzone/dropzone': { type: 'ancestor' },
  },
  methods: {
    __onDropzone({ rejections }) {
      const lines = (rejections || []).map((r) => r.errors.map((e) => e.message).join(' '));
      if (lines.length !== this.data.lines.length || lines.some((l, i) => l !== this.data.lines[i])) {
        this.setData({ lines });
      }
    },
  },
});
