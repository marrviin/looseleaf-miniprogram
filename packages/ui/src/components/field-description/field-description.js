import { createComponent } from '../../common/component';

/** ll-field-description — upstream FieldDescription: the muted help line
    under (or beside) a control. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
