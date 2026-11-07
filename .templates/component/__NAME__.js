import { createComponent } from '../../common/component';
import { props } from './props';

createComponent({
  options: {
    // TODO: set after M0 decides the ink injection strategy
    // styleIsolation: 'shared',
    // externalClasses: ['ll-class'],
  },
  properties: props,
  // TODO: behaviors / methods / events for ll-__NAME__
});
