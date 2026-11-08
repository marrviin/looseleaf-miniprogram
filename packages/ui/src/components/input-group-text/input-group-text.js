import { createComponent } from '../../common/component';

/** ll-input-group-text — upstream InputGroupText: muted text or an icon
    with text for an addon ("https://", "USD"). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
