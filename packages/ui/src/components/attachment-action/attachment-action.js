import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `AttachmentAction` — a ghost icon-xs Button; taps bubble. */
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
