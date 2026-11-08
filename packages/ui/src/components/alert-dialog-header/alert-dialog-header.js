import { createComponent } from '../../common/component';

/** ll-alert-dialog-header — title + description (+media) column. Centered on
    phones; `size` mirrors the content's data-size: on larger screens the
    default size starts its text at the edge while `sm` stays centered.
    `media` marks the two-column sm+ layout (media left, text right). */
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
    media: {
      type: Boolean,
      value: false,
    },
    customStyle: String,
  },
});
