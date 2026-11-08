import { createComponent } from '../../common/component';
import { describeLimits } from '../dropzone/format';
import { props } from './props';

/** Upstream `DropzoneDescription` — states the limits the zone was given
    ("PNG, JPG up to 2 MB each, at most 4 files"); children replace them,
    and nothing is drawn when there are none. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    limits: '',
  },
  relations: {
    '../dropzone/dropzone': { type: 'ancestor' },
  },
  methods: {
    __onDropzone(payload) {
      const limits = describeLimits({
        accept: payload.accept,
        maxSize: payload.maxSize,
        maxFiles: payload.maxFiles,
        multiple: payload.multiple,
      });
      if (limits !== this.data.limits) this.setData({ limits });
    },
  },
});
