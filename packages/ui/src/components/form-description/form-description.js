import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-form-description — upstream FormDescription, the muted helper words
    under the control. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
