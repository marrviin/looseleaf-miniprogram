import { createComponent } from '../../common/component';
import { matchesAccept, sameFile, formatBytes } from './format';
import { props } from './props';

/** Upstream `Dropzone` — the state and the layout. Checks type, size and
    count, keeps `files`/`rejections`, pushes both to every part through
    the relation, and hands events to the page. There is no drag in the
    webview: picking runs through wx.chooseMessageFile (extensions from
    `accept`); the page can also call add/remove/clear directly. Files are
    plain { name, size, type, path, time } objects. */
const PARTS = [
  '../dropzone-area/dropzone-area',
  '../dropzone-icon/dropzone-icon',
  '../dropzone-title/dropzone-title',
  '../dropzone-description/dropzone-description',
  '../dropzone-rejections/dropzone-rejections',
  '../dropzone-list/dropzone-list',
  '../dropzone-item/dropzone-item',
];

const FALLBACKS = {
  'file-invalid-type': (f) => `${f.name} is not a file type we take.`,
  'file-too-large': (f, maxSize) => `${f.name} is larger than ${formatBytes(maxSize)}.`,
  'file-too-small': (f, minSize) => `${f.name} is smaller than ${formatBytes(minSize)}.`,
  'too-many-files': (f, maxFiles, multiple) =>
    multiple ? `Only ${maxFiles} file${maxFiles === 1 ? '' : 's'} at a time.` : 'One file at a time.',
};

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    files: [],
    rejections: [],
  },
  relations: PARTS.reduce((acc, path) => ((acc[path] = { type: 'descendant' }), acc), {}),
  observers: {
    'accept, multiple, maxFiles, maxSize, minSize, disabled, invalid'() {
      this.__push();
    },
  },
  lifetimes: {
    attached() {
      this.__push();
    },
    ready() {
      // relations resolve later than attached (descendants attach after
      // the parent) — re-push once the tree is wired
      this.__push();
    },
  },
  methods: {
    __payload() {
      const d = this.data;
      return {
        files: d.files,
        rejections: d.rejections,
        accept: d.accept,
        multiple: d.multiple,
        maxFiles: d.maxFiles === '' ? null : d.maxFiles,
        maxSize: d.maxSize === '' ? null : d.maxSize,
        minSize: d.minSize === '' ? null : d.minSize,
        disabled: d.disabled,
        invalid: d.invalid,
      };
    },
    __push() {
      const payload = this.__payload();
      for (const rel of PARTS) {
        for (const n of this.getRelationNodes(rel) || []) {
          n.__onDropzone && n.__onDropzone(payload);
        }
      }
    },
    /** Validate a batch against accept/size/count and take what fits.
        Rejections carry their reasons; a clean drop clears them. */
    add(list) {
      const d = this.data;
      if (d.disabled || !list || !list.length) return;
      const multiple = d.multiple !== false;
      const maxFiles = d.maxFiles === '' || d.maxFiles === null || d.maxFiles === undefined ? null : Number(d.maxFiles);
      const maxSize = d.maxSize === '' || d.maxSize === null || d.maxSize === undefined ? null : Number(d.maxSize);
      const minSize = d.minSize === '' || d.minSize === null || d.minSize === undefined ? null : Number(d.minSize);
      const room = multiple ? (maxFiles === null ? Infinity : Math.max(0, maxFiles - d.files.length)) : 1;
      const accepted = [];
      const rejected = [];
      for (const file of list) {
        const errors = [];
        if (!matchesAccept(file, d.accept))
          errors.push({ code: 'file-invalid-type', message: FALLBACKS['file-invalid-type'](file) });
        if (maxSize !== null && Number(file.size) > maxSize)
          errors.push({ code: 'file-too-large', message: FALLBACKS['file-too-large'](file, maxSize) });
        if (minSize !== null && Number(file.size) < minSize)
          errors.push({ code: 'file-too-small', message: FALLBACKS['file-too-small'](file, minSize) });
        if (!errors.length && accepted.length >= room)
          errors.push({
            code: 'too-many-files',
            message: FALLBACKS['too-many-files'](file, maxFiles === null ? d.files.length + 1 : maxFiles, multiple),
          });
        if (errors.length) rejected.push({ file, errors });
        else accepted.push(file);
      }
      const next = accepted.length
        ? multiple
          ? [...d.files.filter((f) => !accepted.some((a) => sameFile(a, f))), ...accepted]
          : [accepted[0]]
        : d.files;
      this.setData({ files: next, rejections: rejected });
      this.__push();
      this.triggerEvent('fileschange', { files: next });
      this.triggerEvent('drop', { accepted, rejected });
      if (rejected.length) this.triggerEvent('reject', { rejected });
    },
    remove(file) {
      if (this.data.disabled) return;
      const next = this.data.files.filter((f) => f !== file);
      this.setData({ files: next, rejections: [] });
      this.__push();
      this.triggerEvent('fileschange', { files: next });
    },
    clear() {
      this.setData({ files: [], rejections: [] });
      this.__push();
      this.triggerEvent('fileschange', { files: [] });
    },
    /** The picker behind the area's tap: chooseMessageFile narrowed by
        accept (extension tokens → extension list; mime tokens → type). */
    open() {
      const d = this.data;
      if (d.disabled) return;
      const tokens = String(d.accept || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const extensions = tokens.filter((t) => t.startsWith('.'));
      let type = 'file';
      if (tokens.length && tokens.every((t) => t.startsWith('image/'))) type = 'image';
      else if (tokens.length && tokens.every((t) => t.startsWith('video/'))) type = 'video';
      const count = d.multiple === false ? 1 : d.maxFiles ? Math.max(1, Number(d.maxFiles) - d.files.length) : 20;
      wx.chooseMessageFile({
        count,
        type,
        ...(extensions.length ? { extension: extensions } : {}),
        success: (res) => {
          this.add(
            (res.tempFiles || []).map((f) => ({
              name: f.name || 'file',
              size: f.size || 0,
              type: f.type || '',
              path: f.path || '',
              time: f.time || 0,
            }))
          );
        },
      });
    },
  },
});
