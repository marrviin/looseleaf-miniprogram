import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `AttachmentTrigger` — the invisible full-surface button. In
    the web build it opens the file dialog; here it reports a press so the
    host can wx.chooseMessageFile / navigate. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  methods: {
    onTap() {
      this.triggerEvent('press', {});
    },
  },
});
