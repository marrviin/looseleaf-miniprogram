import { createComponent } from '../../common/component';
import { props } from './props';

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
