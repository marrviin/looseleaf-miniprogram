import { createComponent } from '../../common/component';
import { formatBytes, iconFor } from '../dropzone/format';
import { props } from './props';

/** Upstream `DropzoneItem` — one file row. The rule under the row is the
    drawing (dropzoneItemRecipe: a pencil rule; error draws it red with a
    squiggle). Images preview through their temp path as a crooked
    polaroid; the highlighter progress line is plain bars (upstream CSS
    too). Remove taps the root's remove and reports to the page. */

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    iconName: 'file',
    preview: '',
    sizeLine: '',
    pct: 0,
    llInkRecipe: 'dropzone-item',
    llInkSelector: '.ll-dropzone-item',
  },
  relations: {
    '../dropzone/dropzone': { type: 'ancestor' },
  },
  observers: {
    'file, status, progress, error'() {
      this.__apply();
    },
    'status, seed'() {
      // The rule is drawn per status (idle/done vs error); re-ink on flip.
      this.__inkParams = { status: this.__inkStatus() };
      setTimeout(() => this.__measureInk && this.__measureInk(), 0);
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = { status: this.__inkStatus() };
      this.__apply();
      setTimeout(() => this.__measureInk && this.__measureInk(), 0);
    },
  },
  methods: {
    __inkStatus() {
      const s = this.data.status;
      return s === 'error' ? 'error' : s === 'done' ? 'done' : 'idle';
    },
    __apply() {
      const d = this.data;
      const file = d.file || {};
      const type = String(file.type || '');
      const preview = d.thumbnail && type.startsWith('image/') && file.path ? file.path : '';
      const size = formatBytes(Number(file.size) || 0);
      let sizeLine;
      if (d.status === 'error' && d.error) sizeLine = d.error;
      else if (d.status === 'done') sizeLine = `${size}, done`;
      else if (d.status === 'uploading' && d.progress !== null && d.progress !== undefined && d.progress !== '')
        sizeLine = `${size}, ${Math.round(Number(d.progress))}%`;
      else sizeLine = size;
      const pct =
        d.status === 'uploading' && d.progress !== null && d.progress !== undefined && d.progress !== ''
          ? Math.max(0, Math.min(100, Number(d.progress)))
          : 0;
      this.setData({
        iconName: iconFor(file),
        preview,
        sizeLine,
        pct,
      });
    },
    onRemove() {
      const file = this.data.file;
      this.triggerEvent('remove', { file });
      const roots = this.getRelationNodes('../dropzone/dropzone') || [];
      const root = roots[0];
      if (root && root.remove && file) root.remove(file);
    },
  },
});
