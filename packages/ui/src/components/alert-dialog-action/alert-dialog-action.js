import { createComponent } from '../../common/component';

/** ll-alert-dialog-action — the confirming answer: a Button that closes the
    dialog after its tap. The tap bubbles up as `alert-action` (the root
    closes on it; the page hears it too). `keepOpen` is upstream's onClick
    preventDefault — the async confirmation keeps the sheet up while it
    works and the page closes it when done. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    /** Any Button variant; use `destructive` for irreversible actions. */
    variant: {
      type: String,
      value: 'default',
    },
    size: {
      type: String,
      value: 'default',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    /** Keep the dialog open on tap (async actions close it themselves). */
    keepOpen: {
      type: Boolean,
      value: false,
    },
  },
  methods: {
    onTap() {
      if (this.data.disabled) return;
      this.triggerEvent('alert-action', { keepOpen: this.data.keepOpen }, { bubbles: true, composed: true });
    },
  },
});
