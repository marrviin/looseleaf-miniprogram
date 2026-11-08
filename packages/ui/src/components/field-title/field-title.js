import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-field-title — upstream FieldTitle: a bold hand title inside a
    FieldContent column (a FieldLabel that isn't a <label>). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
