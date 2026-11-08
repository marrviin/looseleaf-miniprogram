import { createComponent } from '../../common/component';

/** ll-alert-dialog-cancel — the safe answer: an outline Button that closes
    the dialog. The tap bubbles up as `alert-cancel` (the root closes on it;
    the page hears it too). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    /** Any Button variant; the safe answer defaults to outline. */
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
      this.triggerEvent('alert-cancel', {}, { bubbles: true, composed: true });
    },
  },
});
