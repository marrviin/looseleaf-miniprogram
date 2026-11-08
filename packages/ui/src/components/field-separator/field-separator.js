import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-field-separator — upstream FieldSeparator: a rule (with an optional
    word) that rides up between fields (-my-2). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
