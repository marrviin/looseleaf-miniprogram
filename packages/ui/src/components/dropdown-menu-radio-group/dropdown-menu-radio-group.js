import { createComponent } from '../../common/component';

/** ll-dropdown-menu-radio-group — upstream DropdownMenuRadioGroup: holds
    radio rows; `value` makes it controlled. The rows bubble `change`; the
    owner updates `value` (a WeChat group can't feed `checked` down its
    slot, so demos compare the group value themselves). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    value: {
      type: null,
      optionalTypes: [String, Number],
      value: '',
    },
    customStyle: String,
  },
});
