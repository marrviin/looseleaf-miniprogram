import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `AttachmentTitle` — bold, one line; pulses while the slip is
    uploading/processing. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    state: 'done',
  },
  relations: {
    '../attachment/attachment': { type: 'ancestor' },
  },
  methods: {
    __onAttachment({ state }) {
      if (state !== this.data.state) this.setData({ state });
    },
  },
});
