import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { props } from './props';

ensureHandFont();

/** ll-field-legend — upstream FieldLegend: the fieldset heading, in the
    script font (variant legend) or as a bold hand label (variant label). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
