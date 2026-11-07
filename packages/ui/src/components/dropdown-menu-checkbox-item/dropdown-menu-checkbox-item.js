import { createComponent } from '../../common/component';

/** ll-dropdown-menu-checkbox-item — upstream DropdownMenuCheckboxItem: a
    pencil box at the start, ticked in blue felt (written on) when checked.
    Tapping bubbles `change` (NOT `select`) — the menu stays open so
    several rows can be ticked, like upstream's onSelect preventDefault. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    checked: {
      type: null,
      optionalTypes: [Boolean, String],
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
      if (this.data.disabled) return;
      this.triggerEvent(
        'change',
        { value: this.data.value, checked: !this.data.checked },
        { bubbles: true, composed: true }
      );
    },
  },
});
