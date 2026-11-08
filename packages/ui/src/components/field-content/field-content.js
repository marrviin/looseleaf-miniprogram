import { createComponent } from '../../common/component';

/** ll-field-content — upstream FieldContent: the flex-1 word column
    (title + description) beside a control in a horizontal Field. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
