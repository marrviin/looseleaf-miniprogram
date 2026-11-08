import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `DropzoneArea` — the paper patch with a running stitch round
    its edge (dropzoneRecipe: a paper-shade wash, red stitches and a pink
    wash when invalid, pale stitches when disabled). The webview has no
    drag: a tap anywhere opens the picker on the root. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    invalid: false,
    disabled: false,
    llInkRecipe: 'dropzone',
    llInkSelector: '.ll-dropzone-area',
  },
  relations: {
    '../dropzone/dropzone': { type: 'ancestor' },
  },
  lifetimes: {
    attached() {
      this.__measureInk && setTimeout(() => this.__measureInk(), 0);
    },
  },
  methods: {
    __onDropzone(payload) {
      const invalid = payload.invalid === true;
      const disabled = payload.disabled === true;
      this.__inkParams = { over: false, invalid, disabled };
      if (invalid !== this.data.invalid || disabled !== this.data.disabled) {
        this.setData({ invalid, disabled });
        setTimeout(() => this.__measureInk && this.__measureInk(), 0);
      }
    },
    onTap() {
      const roots = this.getRelationNodes('../dropzone/dropzone') || [];
      const root = roots[0];
      if (root && root.open) root.open();
      this.triggerEvent('press', {});
    },
  },
});
