import { createComponent } from '../../common/component';

/** ll-field-set — upstream FieldSet (a real <fieldset>): groups a legend,
    a help line and the fields under it. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
