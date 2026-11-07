import { createComponent } from '../../common/component';

/** ll-dropdown-menu-item — upstream DropdownMenuItem (MENU_ITEM): a row,
    not an ink host — the highlight is the ll-swipe CSS background. Tap
    bubbles `select` (the menu closes on it) unless disabled. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    /** data-inset: extra start padding aligning with choice-row labels. */
    inset: {
      type: Boolean,
      value: false,
    },
    /** 'default' | 'destructive' — red pencil, hatches when highlighted. */
    variant: {
      type: String,
      value: 'default',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    value: {
      type: null,
      optionalTypes: [String, Number],
      value: '',
    },
    customStyle: String,
  },
  methods: {
    onTap() {
      if (this.data.disabled) return;
      this.triggerEvent('select', { value: this.data.value }, { bubbles: true, composed: true });
    },
  },
});
