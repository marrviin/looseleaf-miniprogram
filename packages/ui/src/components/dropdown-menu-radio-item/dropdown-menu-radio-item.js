import { createComponent } from '../../common/component';

/** ll-dropdown-menu-radio-item — upstream DropdownMenuRadioItem: a pencil
    ring with a bold felt dot in the chosen one. Tapping bubbles `change`
    (NOT `select`) — the group's owner updates `value`, the menu stays
    open. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    checked: {
      type: Boolean,
      value: false,
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
      if (this.data.disabled || this.data.checked) return;
      this.triggerEvent('change', { value: this.data.value }, { bubbles: true, composed: true });
    },
  },
});
