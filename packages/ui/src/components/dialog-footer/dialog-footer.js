import { createComponent } from '../../common/component';

/** ll-dialog-footer — buttons, stacked on phones (col-reverse: the primary
    action ends up on top), right-aligned row from sm. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
