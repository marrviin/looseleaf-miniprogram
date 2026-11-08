import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { props } from './props';

ensureHandFont();

/** ll-field — upstream Field: layout and words, nothing drawn. The row
    stacks its slot (label, control, description). `invalid` turns the
    label red (upstream data-invalid → text-destructive). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
