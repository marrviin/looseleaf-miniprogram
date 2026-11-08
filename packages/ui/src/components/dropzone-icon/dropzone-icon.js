import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `DropzoneIcon` — the upload arrow in a 64px square (web also
    swaps in Stubby while dragging; the webview has no drag). Children
    replace the icon via the slot fallback. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  relations: {
    '../dropzone/dropzone': { type: 'ancestor' },
  },
  methods: {
    __onDropzone() {},
  },
});
