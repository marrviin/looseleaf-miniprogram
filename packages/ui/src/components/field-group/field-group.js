import { createComponent } from '../../common/component';

/** ll-field-group — upstream FieldGroup: stacks fields and field-sets
    (gap-7); `tight` is the data-slot=checkbox-group variant (gap-3). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    /** Tighten the gaps for a group of checkboxes/radios. */
    tight: {
      type: Boolean,
      value: false,
    },
    customStyle: String,
  },
});
