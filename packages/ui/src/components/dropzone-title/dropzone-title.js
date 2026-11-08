import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `DropzoneTitle` — script type, default copy with a wavy blue
    "browse". Children replace the words via the slot fallback. */
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
