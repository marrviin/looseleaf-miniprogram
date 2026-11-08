import { createComponent } from '../../common/component';

/** ll-alert-dialog-footer — the answers. Stacked on phones (col-reverse:
    the primary action ends up on top), right-aligned row from sm; with the
    content's `size="sm"` the two answers sit in equal columns instead. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    size: {
      type: String,
      value: 'default',
    },
    customStyle: String,
  },
});
