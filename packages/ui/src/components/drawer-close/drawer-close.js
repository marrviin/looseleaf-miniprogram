import { createComponent } from '../../common/component';

/** ll-drawer-close — the way out: an outline Button whose tap bubbles up as
    `drawer-close` (the root closes on it; the page hears it too). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    variant: {
      type: String,
      value: 'outline',
    },
    size: {
      type: String,
      value: 'default',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
  },
  methods: {
    onTap() {
      if (this.data.disabled) return;
      this.triggerEvent('drawer-close', {}, { bubbles: true, composed: true });
    },
  },
});
